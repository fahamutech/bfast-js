import {FileOptions, StorageAdapter} from "../adapters/StorageAdapter";
import {BFastConfig} from "../conf";
import {RestAdapter} from "../adapters/RestAdapter";

export class StorageController implements StorageAdapter {
    constructor(private readonly file: {
                    fileName: string;
                    data: { base64: string };
                    fileType: string
                }, private readonly restApi: RestAdapter,
                private readonly appName = BFastConfig.DEFAULT_APP) {
    }

    getData(): string {
        return this.file.data?.base64;
    }

    async save(options?: FileOptions): Promise<{ url: string, name: string }> {
        const postHeader = {};
        if (options && options.useMasterKey) {
            Object.assign(postHeader, {
                'X-Parse-Master-Key': BFastConfig.getInstance().getAppCredential(this.appName).appPassword,
            });
        }
        if (options && options.sessionToken) {
            Object.assign(postHeader, {
                'X-Parse-Session-Token': options?.sessionToken
            });
        }
        Object.assign(postHeader, {
            'X-Parse-Application-Id': BFastConfig.getInstance().getAppCredential(this.appName).applicationId,
            'Content-Type': this.file.fileType
        });
        const response = await this.restApi.post<{ url: string, name: string }>(
            BFastConfig.getInstance().databaseURL(this.appName, '/files/' + this.file.fileName),
            this.file.data.base64,
            {
                headers: postHeader
            }
        );
        let url;
        if (options && options.forceSecure) {
            url = response.data.url.replace('http://', 'https://');
        } else {
            url = response.data.url;
        }
        return {
            url: url,
            name: response.data.name
        };
    }

}
