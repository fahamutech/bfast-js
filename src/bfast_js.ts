import {AppCredentials, BFastConfig} from "./conf";
import {DomainController} from "./controllers/domainController";
import {FunctionController} from "./controllers/functionController";
import {StorageController} from "./controllers/StorageController";
import {DomainI} from "./adapters/DomainAdapter";
import {FunctionAdapter} from "./adapters/FunctionsAdapter";
import * as _parse from 'parse';
import {AuthController} from "./controllers/AuthController";
import {SocketController} from "./controllers/SocketController";
import {TransactionAdapter} from "./adapters/TransactionAdapter";
import {TransactionController} from "./controllers/TransactionController";
import {RealTimeAdapter} from "./adapters/RealTimeAdapter";
import {CacheController} from "./controllers/CacheController";
import {CacheAdapter} from "./adapters/CacheAdapter";

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
        return BFastConfig.getInstance(options, appName).getAppCredential();
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
                const cacheName = BFastConfig.getInstance().getAppCredential(appName).cache?.cacheStoreName;
                return new DomainController<T>(
                    name,
                    new CacheController(cacheName ? cacheName : 'bfastLocalDatabase'));
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
                return new TransactionController(isNormalBatch);
            }
        }
    },

    functions: {
        /**
         * exec a cloud function
         * @param path {string} function name
         */
        request(path: string): FunctionAdapter {
            return new FunctionController(path);
        },
        /**
         * start a new socket
         * @param eventName
         * @param onConnect {function} callback when connection established
         * @param onDisconnect {function} callback when connection terminated
         */
        event(eventName: string, onConnect?: Function, onDisconnect?: Function): RealTimeAdapter {
            return new SocketController(eventName, onConnect, onDisconnect);
        }
    },

    /**
     * access initialized parse JS Sdk direct
     */
    directAccess: {
        parseSdk: _parse,
        cache(options?: { cacheName: string, storeName: string }): CacheAdapter {
            const cache = BFastConfig.getInstance().cache?.cacheStoreName;
            return new CacheController(
                options && options.cacheName ? options.cacheName : (cache ? cache : 'bfastLocalDatabase'),
                options && options.storeName ? options.storeName : (cache ? cache : 'bfastLocalDatabase'),
            );
        }
    },

    auth: AuthController,

    storage: {
        getInstance(options: {
            fileName: string,
            data: number[] | { base64: string } | { size: number; type: string; } | { uri: string },
            fileType?: string
        }): StorageController {
            return new StorageController(new _parse.File(options.fileName, options.data, options.fileType));
        }
    }

};
