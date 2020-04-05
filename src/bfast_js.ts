import {BFastConfig} from "./conf";
import {DomainController} from "./controllers/domainController";
import {FunctionController} from "./controllers/functionController";
import {StorageController} from "./controllers/StorageController";
import * as _parse from 'parse';
import {DomainI} from "./core/domainInterface";
import {FunctionAdapter} from "./core/functionInterface";
import {AuthAdapter} from "./core/authAdapter";
import {StorageAdapter} from "./core/storageAdapter";

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
        BFastConfig.cloudDatabaseUrl = options.cloudDatabaseUrl;
        BFastConfig.token = options.token;
        BFastConfig.cloudFunctionsUrl = options.cloudFunctionsUrl;
        BFastConfig.applicationId = options.applicationId;
        BFastConfig.projectId = options.projectId;

        _parse.initialize(BFastConfig.applicationId);
        // @ts-ignore
        _parse.serverURL = BFastConfig.getCloudDatabaseUrl();
    },

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

    /**
     * exec a cloud function
     * @param functionPath {string} function name
     */
    functions: function (functionPath: string): FunctionAdapter {
        return new FunctionController(functionPath);
    },

    auth: function (user?: { username: string, password: string }): AuthAdapter {
        return new _parse.User(user ? user : null);
    },

    storage: function (options: {
        name: string,
        data: number[] | { base64: string } | { size: number; type: string; } | { uri: string },
        type?: string
    }): StorageAdapter {
        return new StorageController(new _parse.File(options.name, options.data, options.type));
    }

};
