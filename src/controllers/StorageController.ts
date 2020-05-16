import {FileOptions, StorageAdapter} from "../adapters/StorageAdapter";
import {BFastConfig} from "../conf";
import {RestAdapter} from "../adapters/RestAdapter";

export class StorageController implements StorageAdapter {

    private fileData: any = null;

    constructor(private readonly restApi: RestAdapter,
                private readonly appName = BFastConfig.DEFAULT_APP) {
    }

    getData(): any {
        return this.fileData
    }

    async save(file: { fileName: string, data: { base64: string }, fileType: string }, options?: FileOptions): Promise<{ url: string }> {
        if (!(file && file.fileName && file.data)) {
            throw new Error('file object to save required');
        }
        this.fileData = (file && file.data) ? file.data : null
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
            'content-type': 'application/json'
        });
        const _source = StorageController.getSource(file.data.base64, file.fileType);
        const dataToSave: {
            type?: any,
            base64: string,
            filename: string,
            fileData: Object,
        } = {
            base64: _source.base64,
            filename: file.fileName,
            fileData: {
                metadata: {},
                tags: {},
            },
        }
        if (_source.type) {
            dataToSave.type = _source.type;
        }
        console.log(dataToSave);
        const response = await this.restApi.post<{ url: string, name: string }>(
            BFastConfig.getInstance().databaseURL(this.appName, '/storage'), dataToSave,
            {
                headers: postHeader
            }
        );
        let databaseUrl = BFastConfig.getInstance().databaseURL(this.appName);
        databaseUrl = databaseUrl.replace('http://', '');
        databaseUrl = databaseUrl.replace('https://', '');
        let url;
        if (options && options.forceSecure) {
            url = response.data.url.replace('http://', 'https://');
        } else {
            url = response.data.url;
        }
        return {
            url: url.replace('localhost:3000', databaseUrl)
        };
    }

    private static getSource(base64: string, type: string) {
        let _data: string;
        let _source: {
            format: string,
            base64: string,
            type: any;
        };
        const dataUriRegexp = /^data:([a-zA-Z]+\/[-a-zA-Z0-9+.]+)(;charset=[a-zA-Z0-9\-\/]*)?;base64,/;
        const commaIndex = base64.indexOf(',');

        if (commaIndex !== -1) {
            const matches = dataUriRegexp.exec(base64.slice(0, commaIndex + 1));
            // console.log(matches);
            // if data URI with type and charset, there will be 4 matches.
            _data = base64.slice(commaIndex + 1);
            console.log(_data.substring(0, 50));
            _source = {
                format: 'base64',
                base64: _data,
                type: matches && matches.length > 0 ? matches[1] : type
            };
        } else {
            _data = base64;
            console.log(_data.substring(0, 50));
            _source = {
                format: 'base64',
                base64: _data,
                type: type
            };
        }
        return _source;
    }

}
