import {AppCredentials, BFastConfig} from "./conf";
import {DomainController} from "./controllers/domainController";
import {FunctionController} from "./controllers/functionController";
import {StorageController} from "./controllers/StorageController";
import {DomainI} from "./core/DomainAdapter";
import {FunctionAdapter} from "./core/FunctionsAdapter";
import * as _parse from 'parse';
import {AuthController} from "./controllers/AuthController";
import {SocketController} from "./controllers/SocketController";
import {TransactionAdapter} from "./core/TransactionAdapter";
import {TransactionController} from "./controllers/TransactionController";
import {RealTimeAdapter} from "./core/RealTimeAdapter";
import {CacheController} from "./controllers/CacheController";
import {CacheAdapter} from "./core/CacheAdapter";

/**
 * Created and maintained by Fahamu Tech Ltd Company
 * @maintained Fahamu Tech ( fahamutechdevelopers@gmail.com )
 */

export const BFast = {

    /**
     *
     * @param options
     * @param appName {string} application name for multiple apps access
     */
    init(options: AppCredentials, appName: string = BFastConfig.DEFAULT_APP) {
        options.cache
        const appCredentials = BFastConfig.getInstance(options, appName).getAppCredential()
        // _parse.initialize(<string>appCredentials.applicationId, undefined, appCredentials.appPassword);
        // // @ts-ignore
        // _parse.serverURL = appCredentials.databaseURL;
        // _parse.CoreManager.set('REQUEST_BATCH_SIZE', 1000000);
    },

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
            transaction(): TransactionAdapter {
                return new TransactionController();
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
