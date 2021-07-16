import {FunctionsController} from "./controllers/functions.controller";
import {HttpClientController} from "./controllers/http-client.controller";
import {SocketController} from "./controllers/socket.controller";
import {HttpRequestModel} from "./models/HttpRequestModel";
import {EventResponseModel, HttpResponseModel} from "./models/HttpResponseModel";
import {HttpNextModel} from "./models/HttpNextModel";
// @ts-ignore
import * as device from "browser-or-node";
import { AuthController } from "./controllers/auth.controller";
import { BFastConfig } from "./conf";
import { CacheController } from "./controllers/cache.controller";

export class BfastFunctions {
    constructor(private readonly appName: string,
        private authController: AuthController,
        private httpClientController: HttpClientController) {
    }

    private init(){
        const config = BFastConfig.getInstance();
        const authCache = new CacheController(
            this.appName,
            config.DEFAULT_CACHE_DB_BFAST,
            config.DEFAULT_CACHE_COLLECTION_USER,
            config.cacheAdapter(this.appName)
        );
        const restController = new HttpClientController(
            this.appName,
            config.httpAdapter(this.appName)
        )
        const authController = new AuthController(
            this.appName,
            authCache,
            config.authAdapter(this.appName)
        );
        if(!this.authController){
            this.authController = authController;
        }
        if(!this.httpClientController){
            this.httpClientController = restController;
        }
    }

    /**
     * exec a http client request
     * @param path {string} function name
     */
    request(path: string): FunctionsController {
        this.init();
        return new FunctionsController(
            path,
            this.httpClientController,
            this.authController,
            this.appName
        );
    }

    /**
     * listen for a realtime event from a bfast::functions
     * @param eventName
     * @param onConnect {function} callback when connection established
     * @param onDisconnect {function} callback when connection terminated
     */
    event(eventName: string, onConnect?: Function, onDisconnect?: Function): SocketController {
        return new SocketController(eventName, this.appName, onConnect, onDisconnect);
    }

    onHttpRequest(path: string,
                  handler: ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)[]
                      | ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)) {
        if (device.isNode) {
            return {
                method: null,
                path: path,
                onRequest: handler
            };
        } else {
            throw 'Works In NodeJs Environment Only'
        }
    }

    onPostHttpRequest(path: string,
                      handler: ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)[]
                          | ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)) {
        if (device.isNode) {
            return {
                method: 'POST',
                path: path,
                onRequest: handler
            };
        } else {
            throw 'Works In NodeJs Environment Only'
        }
    }

    onPutHttpRequest(path: string,
                     handler: ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)[]
                         | ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)) {
        if (device.isNode) {
            return {
                method: 'PUT',
                path: path,
                onRequest: handler
            };
        } else {
            throw 'Works In NodeJs Environment Only'
        }
    }

    onDeleteHttpRequest(path: string,
                        handler: ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)[]
                            | ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)) {
        if (device.isNode) {
            return {
                method: 'DELETE',
                path: path,
                onRequest: handler
            };
        } else {
            throw 'Works In NodeJs Environment Only'
        }
    }

    onGetHttpRequest(path: string,
                     handler: ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)[]
                         | ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)) {
        if (device.isNode) {
            return {
                method: 'GET',
                path: path,
                onRequest: handler
            };
        } else {
            throw 'Works In NodeJs Environment Only'
        }
    }

    onEvent(path: string, handler: (request: { auth?: any, body?: any }, response: EventResponseModel) => any) {
        if (device.isNode) {
            return {
                name: path,
                onEvent: handler
            };
        } else {
            throw 'Works In NodeJs Environment Only'
        }
    }

    onGuard(path: string, handler: ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)[]
        | ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)) {
        if (device.isNode) {
            return {
                path: path,
                onGuard: handler
            };
        } else {
            throw 'Works In NodeJs Environment Only'
        }
    }

    onJob(schedule: {
        second?: string,
        minute?: string,
        hour?: string,
        day?: string,
        month?: string,
        dayOfWeek?: string
    }, handler: (job: any) => any) {
        const defaultRule: any = {second: '*', minute: '*', month: '*', day: '*', dayOfWeek: '*', hour: '*'};
        Object.keys(schedule).forEach(key => {
            delete defaultRule[key];
        });
        Object.assign(schedule, defaultRule);
        // @ts-ignore
        const rule: any = Object.keys(schedule).map(x => schedule[x]).join(' ');
        if (device.isNode) {
            return {
                onJob: handler,
                rule: rule,
            };
        } else {
            throw 'Works In NodeJs Environment Only';
        }
    }
}
