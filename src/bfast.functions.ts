import {FunctionsController} from "./controllers/FunctionsController";
import {AxiosRestController} from "./controllers/AxiosRestController";
import {AuthController} from "./controllers/AuthController";
import {CacheController} from "./controllers/CacheController";
import {BFastConfig} from "./conf";
import {SocketController} from "./controllers/SocketController";
import {HttpRequestModel} from "./models/HttpRequestModel";
import {EventResponseModel, HttpResponseModel} from "./models/HttpResponseModel";
import {HttpNextModel} from "./models/HttpNextModel";
// @ts-ignore
import * as device from "browser-or-node";

export class BfastFunctions {
    constructor(private readonly appName: string) {
    }

    /**
     * exec a http client request
     * @param path {string} function name
     */
    request(path: string): FunctionsController {
        const config = BFastConfig.getInstance();
        const _restController = new AxiosRestController();
        return new FunctionsController(
            path,
            _restController,
            new AuthController(
                this.appName,
                _restController,
                new CacheController(
                    this.appName,
                    config.cacheDatabaseName(BFastConfig.getInstance().DEFAULT_AUTH_CACHE_DB_NAME(), this.appName),
                    config.cacheCollectionName(`cache`, this.appName),
                    config.cacheAdapter(this.appName)
                ),
                config.authAdapter(this.appName)
            ),
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
