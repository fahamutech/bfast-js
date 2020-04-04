import {Config} from "./configuration";
import {DomainController} from "./controllers/domainController";
import {FunctionController} from "./controllers/functionController";

/**
 * Created and maintained by Fahamu Tech Ltd Company
 * @maintained Joshua Mshana ( mama27j@gmail.com )
 */

/**
 *
 * @param options
 */
export var init = function (options: {
    cloudDatabaseUrl?: string,
    cloudFunctionsUrl?: string,
    applicationId: string,
    projectId: string,
    token?: string,
}) {
    Config.cloudDatabaseUrl = options.cloudDatabaseUrl;
    Config.token = options.token;
    Config.cloudFunctionsUrl = options.cloudFunctionsUrl;
    Config.applicationId = options.applicationId;
    Config.projectId = options.projectId;
};

export var domain = function (name: string) {
    return new DomainController(name, new Config());
};

export var collection = domain;
export var table = domain;

export var functions = function (functionName: string) {
    return new FunctionController(functionName, new Config());
};
