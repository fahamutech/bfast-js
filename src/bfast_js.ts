import {BFastConfig} from "./conf";
import {DomainController} from "./controllers/domainController";
import {FunctionController} from "./controllers/functionController";
import {AuthController} from "./controllers/AuthController";
import {StorageController} from "./controllers/StorageController";
import * as _parse from 'parse';

export namespace BFast {
    /**
     * Created and maintained by Fahamu Tech Ltd Company
     * @maintained Joshua Mshana ( mama27j@gmail.com )
     */

    /**
     *
     * @param options
     */
    export const init = function (options: {
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

        console.log(BFastConfig);

        _parse.initialize(BFastConfig.applicationId);
        // @ts-ignore
        _parse.serverURL = BFastConfig.getCloudDatabaseUrl();
    };

    /**
     * it export api for domain
     * @param name {string} domain name
     */
    export const domain = function (name: string) {
        return new DomainController(name, _parse);
    };

    /**
     * same as #domain
     */
    export const collection = domain;
    /**
     * same as #domain
     */
    export const table = domain;

    /**
     * exec a cloud function
     * @param functionPath {string} function name
     */
    export const functions = function (functionPath: string) {
        return new FunctionController(functionPath);
    };

    export const auth = function () {
        return new AuthController(new _parse.User());
    };

    export const storage = function (options: {
        name: string,
        data: number[] | { base64: string } | { size: number; type: string; } | { uri: string },
        type?: string
    }) {
        return new StorageController(new _parse.File(options.name, options.data, options.type));
    }

}
