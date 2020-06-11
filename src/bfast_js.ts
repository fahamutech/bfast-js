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

    functions(appName = BFastConfig.DEFAULT_APP) {
        return {
            /**
             * exec a cloud function
             * @param path {string} function name
             */
            request(path: string): FunctionAdapter {
                return new FunctionController(path, new AxiosRestController(), appName);
            },
            /**
             * start a new socket
             * @param eventName
             * @param onConnect {function} callback when connection established
             * @param onDisconnect {function} callback when connection terminated
             */
            event(eventName: string, onConnect?: Function, onDisconnect?: Function): RealTimeAdapter {
                return new SocketController(eventName, appName, onConnect, onDisconnect);
            },
            onHttpRequest(path: string,
                          handler: ((request: any, response: any, next?: any) => any)[]
                              | ((request: any, response: any, next?: any) => any)) {
                if (device.isNode) {
                    return {
                        method: null,
                        path: path,
                        onRequest: handler
                    };
                } else {
                    throw 'Works In NodeJs Environment Only'
                }
            },
            onPostHttpRequest(path: string,
                              handler: ((request: any, response: any, next?: any) => any)[]
                                  | ((request: any, response: any, next?: any) => any)) {
                if (device.isNode) {
                    return {
                        method: 'POST',
                        path: path,
                        onRequest: handler
                    };
                } else {
                    throw 'Works In NodeJs Environment Only'
                }
            },
            onPutHttpRequest(path: string,
                             handler: ((request: any, response: any, next?: any) => any)[]
                                 | ((request: any, response: any, next?: any) => any)) {
                if (device.isNode) {
                    return {
                        method: 'PUT',
                        path: path,
                        onRequest: handler
                    };
                } else {
                    throw 'Works In NodeJs Environment Only'
                }
            },
            onDeleteHttpRequest(path: string,
                                handler: ((request: any, response: any, next?: any) => any)[]
                                    | ((request: any, response: any, next?: any) => any)) {
                if (device.isNode) {
                    return {
                        method: 'DELETE',
                        path: path,
                        onRequest: handler
                    };
                } else {
                    throw 'Works In NodeJs Environment Only'
                }
            },
            onGetHttpRequest(path: string,
                             handler: ((request: any, response: any, next?: any) => any)[]
                                 | ((request: any, response: any, next?: any) => any)) {
                if (device.isNode) {
                    return {
                        method: 'GET',
                        path: path,
                        onRequest: handler
                    };
                } else {
                    throw 'Works In NodeJs Environment Only'
                }
            },
            onEvent(eventName: string,
                    handler: (data: { auth: any, payload: any, socket: any }) => any) {
                if (device.isNode) {
                    return {
                        name: eventName,
                        onEvent: handler
                    };
                } else {
                    throw 'Works In NodeJs Environment Only'
                }
            },
        }
    },

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

    storage(appName = BFastConfig.DEFAULT_APP): StorageController {
        return new StorageController(new AxiosRestController(), appName);
    }

};
