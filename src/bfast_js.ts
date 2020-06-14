import {AppCredentials, BFastConfig} from "./conf";
import {DomainController} from "./controllers/DomainController";
import {FunctionController} from "./controllers/FunctionController";
import {StorageController} from "./controllers/StorageController";
import {DomainI} from "./adapters/DomainAdapter";
import {FunctionAdapter} from "./adapters/FunctionsAdapter";
import {AuthController} from "./controllers/AuthController";
import {SocketController} from "./controllers/SocketController";
import {TransactionAdapter} from "./adapters/TransactionAdapter";
import {TransactionController} from "./controllers/TransactionController";
import {RealTimeAdapter} from "./adapters/RealTimeAdapter";
import {CacheController} from "./controllers/CacheController";
import {CacheAdapter} from "./adapters/CacheAdapter";
import {AxiosRestController} from "./controllers/AxiosRestController";
// @ts-ignore
import * as device from "browser-or-node";
import {HttpRequestModel} from "./model/HttpRequestModel";
import {HttpResponseModel} from "./model/HttpResponseModel";
import {HttpNextModel} from "./model/HttpNextModel";


/**
 * Created and maintained by Fahamu Tech Ltd Company
 * @maintained Fahamu Tech ( fahamutechdevelopers@gmail.com )
 */

export const BFast = {

    /**
     *
     * @param options
     * @param appName {string} application name for multiple apps access
     * @return AppCredentials of current init project
     */
    init(options: AppCredentials, appName: string = BFastConfig.DEFAULT_APP): AppCredentials {
        options.cache = {
            enable: false,
        }
        return BFastConfig.getInstance(options, appName).getAppCredential(appName);
    },

    /**
     * return a config object
     */
    getConfig(): BFastConfig {
        return BFastConfig.getInstance();
    },

    /**
     *
     * @param appName other app/project name from DEFAULT to work with
     */
    database(appName: string = BFastConfig.DEFAULT_APP) {
        return {
            /**
             * a domain/table/collection to deal with
             * @param domainName {string} domain name
             */
            domain<T>(domainName: string): DomainI<T> {
                return new DomainController<T>(
                    domainName,
                    new CacheController(
                        appName,
                        BFastConfig.getInstance().getCacheDatabaseName(BFastConfig.getInstance().DEFAULT_CACHE_DB_NAME, appName),
                        BFastConfig.getInstance().getCacheCollectionName(domainName, appName),
                    ),
                    new AxiosRestController(),
                    appName
                );
            },

            /**
             * same as #domain
             */
            collection<T>(collectionName: string): DomainI<T> {
                return this.domain<T>(collectionName);
            },
            /**
             * same as #domain
             */
            table<T>(tableName: string): DomainI<T> {
                return this.domain<T>(tableName);
            },

            /**
             * perform transaction to remote database
             * @return {TransactionAdapter}
             */
            transaction(isNormalBatch?: boolean): TransactionAdapter {
                return new TransactionController(appName, new AxiosRestController(), isNormalBatch);
            }
        }
    },

    /**
     *
     * @param appName other app/project name to work with
     */
    functions(appName = BFastConfig.DEFAULT_APP) {
        return getFunctionsMap(appName, device.isNode);
    },

    /**
     * get cache instance to work with when work in a browser
     * @param options
     * @param appName other app/project name to work with
     */
    cache(options?: { database: string, collection: string }, appName = BFastConfig.DEFAULT_APP): CacheAdapter {
        return new CacheController(
            appName,
            (options && options.database)
                ? BFastConfig.getInstance().getCacheDatabaseName(options.database, appName)
                : BFastConfig.getInstance().getCacheDatabaseName(BFastConfig.getInstance().DEFAULT_CACHE_DB_NAME, appName),
            (options && options.collection)
                ? BFastConfig.getInstance().getCacheCollectionName(options.collection, appName)
                : BFastConfig.getInstance().getCacheCollectionName('cache', appName),
        );
    },

    /**
     * get auth instance to work with authentication and authorization
     * @param appName other app/project name to work with
     */
    auth(appName = BFastConfig.DEFAULT_APP) {
        return new AuthController(
            new AxiosRestController(),
            new CacheController(
                appName,
                BFastConfig.getInstance().getCacheDatabaseName(BFastConfig.getInstance().DEFAULT_AUTH_CACHE_DB_NAME, appName),
                BFastConfig.getInstance().getCacheCollectionName(`cache`, appName)
            ),
            appName
        );
    },

    /**
     * utils and enums
     */
    utils: {
        USER_DOMAIN_NAME: '_User'
    },

    /**
     * access to storage instance from your bfast::database project
     * @param appName
     */
    storage(appName = BFastConfig.DEFAULT_APP): StorageController {
        return new StorageController(new AxiosRestController(), appName);
    }

};

const getFunctionsMap = function (appName: string, isNode: boolean) {
    if (isNode) {
        return {
            /**
             * exec http client request
             * @param path {string} function name
             */
            request(path: string): FunctionAdapter {
                return new FunctionController(path, new AxiosRestController(), appName);
            },
            onHttpRequest(path: string,
                          handler: ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)[]
                              | ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)) {
                return {
                    method: null,
                    path: path,
                    onRequest: handler
                };
            },
            onPostHttpRequest(path: string,
                              handler: ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)[]
                                  | ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)) {
                return {
                    method: 'POST',
                    path: path,
                    onRequest: handler
                };
            },
            onPutHttpRequest(path: string,
                             handler: ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)[]
                                 | ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)) {
                return {
                    method: 'PUT',
                    path: path,
                    onRequest: handler
                };
            },
            onDeleteHttpRequest(path: string,
                                handler: ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)[]
                                    | ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)) {
                return {
                    method: 'DELETE',
                    path: path,
                    onRequest: handler
                };
            },
            onGetHttpRequest(path: string,
                             handler: ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)[]
                                 | ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)) {
                return {
                    method: 'GET',
                    path: path,
                    onRequest: handler
                };
            },
            onEvent(eventName: string, handler: (data: { auth: any, payload: any, socket: any }) => any) {
                return {
                    name: eventName,
                    onEvent: handler
                };
            },
        }
    } else {
        return {
            /**
             * exec a http client request
             * @param path {string} function name
             */
            request(path: string): FunctionAdapter {
                return new FunctionController(path, new AxiosRestController(), appName);
            },
            /**
             * listen for a realtime event from a bfast::functions
             * @param eventName
             * @param onConnect {function} callback when connection established
             * @param onDisconnect {function} callback when connection terminated
             */
            event(eventName: string, onConnect?: Function, onDisconnect?: Function): RealTimeAdapter {
                return new SocketController(eventName, appName, onConnect, onDisconnect);
            }
        }
    }
}
