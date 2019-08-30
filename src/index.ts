import { Config } from "./controllers/configuration";
import { DomainController } from "./controllers/domainController";

/**
 * Created and maintained by FahamuTech Ltd Company
 * @Joshua Mshana ( mama27j@gmail.com )
 */

export var init = function(options: {serverUrl: string, apiKey: string}){
    Config.serverUrl = options.serverUrl;
    Config.apiKey = options.apiKey
};

export var domain = function(name: string){
    return new DomainController(name, new Config());
};
