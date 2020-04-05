import {BFastConfig} from "./conf";
import {DomainController} from "./controllers/domainController";
import {FunctionController} from "./controllers/functionController";
import {StorageController} from "./controllers/StorageController";
import {DomainI} from "./core/domainInterface";
import {FunctionAdapter} from "./core/functionInterface";
import {StorageAdapter} from "./core/storageAdapter";
import * as _parse from 'parse';
import {AuthController} from "./controllers/AuthController";

/**
 * Created and maintained by Fahamu Tech Ltd Company
 * @maintained Joshua Mshana ( mama27j@gmail.com )
 */

export const BFast = {

    /**
     *
     * @param options
     */
    init: function (options: {
        cloudDatabaseUrl?: string,
        cloudFunctionsUrl?: string,
        applicationId: string,
        projectId: string,
        token?: string,
    }) {
        BFastConfig.getInstance().cloudDatabaseUrl = options.cloudDatabaseUrl ? options.cloudDatabaseUrl : '';
        BFastConfig.getInstance().token = options.token ? options.token : '';
        BFastConfig.getInstance().cloudFunctionsUrl = options.cloudFunctionsUrl ? options.cloudFunctionsUrl : '';
        BFastConfig.getInstance().applicationId = options.applicationId;
        BFastConfig.getInstance().projectId = options.projectId;

        _parse.initialize(BFastConfig.getInstance().applicationId);
        // @ts-ignore
        _parse.serverURL = BFastConfig.getInstance().getCloudDatabaseUrl();
    },

    database: {
        /**
         * it export api for domain
         * @param name {string} domain name
         */
        domain: function (name: string): DomainI {
            return new DomainController(name, _parse);
        },

        /**
         * same as #domain
         */
        collection: function (collectionName: string): DomainI {
            return this.domain(collectionName);
        },
        /**
         * same as #domain
         */
        table: function (tableName: string): DomainI {
            return this.domain(tableName);
        },
    },

    functions: {
        /**
         * exec a cloud function
         * @param path {string} function name
         */
        request: function (path: string): FunctionAdapter {
            return new FunctionController(path);
        },

    },

    auth: AuthController,

    storage: {
        getInstance: function (options: {
            fileName: string,
            data: number[] | { base64: string } | { size: number; type: string; } | { uri: string },
            fileType?: string
        }): StorageAdapter {
            return new StorageController(new _parse.File(options.fileName, options.data, options.fileType));
        }
    }

};
