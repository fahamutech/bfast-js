import { Config } from "./configuration";
import { DomainController } from "./controllers/domainController";
import { FunctionController } from "./controllers/functionController";

/**
 * Created and maintained by Fahamu Tech Ltd Company
 * @maintained Joshua Mshana ( mama27j@gmail.com )
 */

export var init = function(options: {serverUrl: string, apiKey: string}){
    Config.serverUrl = options.serverUrl;
    Config.apiKey = options.apiKey
};

export var domain = function(name: string){
    return new DomainController(name, new Config());
};

export var fun = function(functionName: string){
    return new FunctionController(functionName, new Config());
};
