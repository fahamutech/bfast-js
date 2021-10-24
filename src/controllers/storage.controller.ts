import {AppCredentials, BFastConfig} from "../conf";
import {RulesController} from "./rules.controller";
import {AuthController} from "./auth.controller";
import {FileOptions, RequestOptions} from "./query.controller";
import {FileModel} from "../models/file.model";
import {HttpClientController} from "./http-client.controller";
import {isBrowserLike} from "../utils/platform.util";
// @ts-ignore
import FormData from 'form-data'
import {getConfig} from "../bfast";

export class StorageController {

    constructor(private readonly httpClientController: HttpClientController,
                private readonly auth: AuthController,
                private readonly rulesController: RulesController,
                private readonly authController: AuthController,
                private readonly appName = BFastConfig.DEFAULT_APP) {
    }

    async save(file: FileModel, uploadProgress: (progress: any) => void, options?: FileOptions): Promise<string> {
        if (!isBrowserLike) {
            try {
                if (file && file.filename && file.data) {
                    return this._handleFileUploadInNode(file, uploadProgress, BFastConfig.getInstance().credential(this.appName), options);
                } else {
                    throw new Error('file object to save is invalid, data and filename is required field');
                }
            } catch (e) {
                console.log(e);
                throw e;
            }
        } else {
            if (file && file.data && file.data instanceof File && file.filename) {
                return this._handleFileUploadInWeb(file, uploadProgress, BFastConfig.getInstance().credential(this.appName), options);
            } else {
                throw new Error('file object to save is invalid, data and filename is required field');
            }
        }
    }

    async list(query: { keyword?: string, size?: number, skip?: number, after?: string } = {}, options?: RequestOptions): Promise<any[]> {
        const filesRule = await this.rulesController.storage("list", query, BFastConfig.getInstance().credential(this.appName), options);
        return this._handleFileRuleRequest(filesRule, 'list');
    }

    getUrl(filename: string) {
        const config = getConfig(this.appName);
        return `${config.databaseURL(this.appName,'')}/storage/${config.credential(this.appName).applicationId}/file/${filename}`;
    }

    async delete(filename: string, options?: RequestOptions): Promise<string> {
        const filesRule = await this.rulesController.storage("delete", {filename}, BFastConfig.getInstance().credential(this.appName), options);
        return this._handleFileRuleRequest(filesRule, 'delete');
    }

    private async _handleFileRuleRequest(storageRule: any, action: string): Promise<any> {
        const credential = BFastConfig.getInstance().credential(this.appName);
        const response = await this.httpClientController.post(
            BFastConfig.getInstance().databaseURL(this.appName),
            storageRule,
            {
                headers: {
                    'x-bfast-application-id': credential.applicationId
                }
            },
            {
                context: '_Storage',
                rule: 'storage',
                type: 'daas',
                token: await this.authController.getToken()
            });
        const data = response.data;
        if (data && data.files && data.files.list && Array.isArray(data.files.list)) {
            return data.files.list;
        } else {
            const errors = data.errors;
            throw errors && errors[`files.${action}`] ? errors[`files.${action}`] : {
                message: 'Fails to process your request',
                errors
            };
        }
    }

    private async _fileUploadRequest(formData: any, headers: object, applicationId: string, progress: any, options: FileOptions) {
        const query = {};
        Object.assign(query, {
            pn: options.pn ? options.pn : false,
        });
        if (options.filename) {
            Object.assign(query, {
                filename: options.filename
            });
        }
        return this.httpClientController.post<{ urls: string[] }>(
            BFastConfig.getInstance().databaseURL(this.appName, '/storage/' + applicationId),
            formData,
            {
                onUploadProgress: progress,
                headers,
                params: query
            },
            {
                context: '_Storage',
                rule: 'storage',
                type: 'daas',
                token: await this.authController.getToken()
            }
        );
    }

    private async _handleFileUploadInNode(file: FileModel, uploadProgress: (progress: any) => void,
                                          appCredentials: AppCredentials, options: FileOptions = {}): Promise<string> {
        const headers = {}
        if (options && options?.useMasterKey === true) {
            Object.assign(headers, {
                'masterKey': appCredentials.appPassword
            });
        }
        const token = await this.auth.getToken();
        const formData = new FormData();
        formData.append('file', file.data, {
            filename: file.filename
        });
        Object.assign(headers, {
            'Authorization': `Bearer ${token}`,
            ...formData.getHeaders()
        });
        options.pn = file.pn;
        options.filename = file.filename;
        const response = await this._fileUploadRequest(
            formData,
            headers,
            appCredentials.applicationId,
            uploadProgress,
            options
        );
        let databaseUrl = BFastConfig.getInstance().databaseURL(this.appName,'');
        return databaseUrl + response.data.urls[0];
    }

    private async _handleFileUploadInWeb(file: FileModel, uploadProgress: (progress: any) => void,
                                         appCredentials: AppCredentials, options: FileOptions = {}): Promise<string> {
        const headers = {}
        if (options && options?.useMasterKey === true) {
            Object.assign(headers, {
                'masterKey': appCredentials.appPassword
            });
        }
        const token = await this.auth.getToken();
        Object.assign(headers, {
            'Authorization': `Bearer ${token}`
        });
        const formData = new FormData();
        formData.append('file', file.data as any, file.filename);
        options.pn = file.pn;
        options.filename = file.filename;
        const response = await this._fileUploadRequest(
            formData, headers, appCredentials.applicationId, uploadProgress, options
        )
        let databaseUrl = BFastConfig.getInstance().databaseURL(this.appName,'');
        return databaseUrl + response.data.urls[0];
    }
}
