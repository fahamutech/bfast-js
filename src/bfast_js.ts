import {AppCredentials, BFastConfig} from "./conf";
import {DomainController} from "./controllers/domainController";
import {FunctionController} from "./controllers/functionController";
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
        options.cache
        return BFastConfig.getInstance(options, appName).getAppCredential(appName);
    },

    /**
     *
     * @param appName other app/project name from DEFAULT to work with
     */
    database(appName: string = BFastConfig.DEFAULT_APP) {
        return {
            /**
             * it export api for domain
             * @param name {string} domain name
             */
            domain<T>(name: string): DomainI<T> {
                return new DomainController<T>(
                    name,
                    new CacheController(appName,
                        BFastConfig.getInstance().getCacheDatabaseName('bfastLocalDatabase', appName),
                        BFastConfig.getInstance().getCacheCollectionName('cache', appName)
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
            }
        }
    },

    cache(options?: { cacheName: string, storeName: string }, appName = BFastConfig.DEFAULT_APP): CacheAdapter {
        return new CacheController(
            appName,
            options && options.cacheName ? BFastConfig.getInstance().getCacheCollectionName(options.cacheName, appName) :
                BFastConfig.getInstance().getCacheDatabaseName('bfastLocalDatabase', appName),
            options && options.storeName ? BFastConfig.getInstance().getCacheCollectionName(options.storeName, appName)
                : BFastConfig.getInstance().getCacheCollectionName('cache', appName),
        );
    },

    auth(appName = BFastConfig.DEFAULT_APP) {
        return new AuthController(
            new AxiosRestController(),
            new CacheController(
                appName,
                BFastConfig.getInstance().getCacheCollectionName('bfastLocalDatabase', appName),
                BFastConfig.getInstance().getCacheCollectionName(`auth`, appName)
            ),
            appName
        );
    },

    storage(appName = BFastConfig.DEFAULT_APP): StorageController {
        return new StorageController(new AxiosRestController(), appName);
    }

};
