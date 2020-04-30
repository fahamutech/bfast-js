import {BFastConfig} from "./conf";
import {DomainController} from "./controllers/domainController";
import {FunctionController} from "./controllers/functionController";
import {StorageController} from "./controllers/StorageController";
import {DomainI} from "./core/DomainAdapter";
import {FunctionAdapter} from "./core/FunctionsAdapter";
import {StorageAdapter} from "./core/StorageAdapter";
import * as _parse from 'parse';
import {AuthController} from "./controllers/AuthController";
import {SocketController} from "./controllers/SocketController";
import {TransactionAdapter} from "./core/TransactionAdapter";
import {TransactionController} from "./controllers/TransactionController";
import {RealTimeAdapter} from "./core/RealTimeAdapter";
import {CacheController} from "./controllers/CacheController";

/**
 * Created and maintained by Fahamu Tech Ltd Company
 * @maintained Fahamu Tech ( fahamutechdevelopers@gmail.com )
 */

export const BFast = {

    /**
     *
     * @param options
     */
    init: function (options: {
        cloudDatabaseUrl?: string,
        cloudFunctionsUrl?: string,
        applicationId: string,
        projectId: string,
        token?: string,
        appPassword?: string,
        cache?: {
            enable: boolean,
            cacheName: string,
            cacheDtlName: string,
        }
    }) {
        BFastConfig.getInstance().cloudDatabaseUrl = options.cloudDatabaseUrl ? options.cloudDatabaseUrl : '';
        BFastConfig.getInstance().token = options.token ? options.token : '';
        BFastConfig.getInstance().cloudFunctionsUrl = options.cloudFunctionsUrl ? options.cloudFunctionsUrl : '';
        BFastConfig.getInstance().applicationId = options.applicationId;
        BFastConfig.getInstance().projectId = options.projectId;
        BFastConfig.getInstance().appPassword = options.appPassword;
        BFastConfig.getInstance().cache = options.cache ? options.cache : {
            enable: true,
            cacheName: 'bfast_cache',
            cacheDtlName: 'bfast_cache_dtl',
        }

        _parse.initialize(<string>BFastConfig.getInstance().applicationId, undefined, BFastConfig.getInstance().appPassword);
        // @ts-ignore
        _parse.serverURL = BFastConfig.getInstance().getCloudDatabaseUrl();
        _parse.CoreManager.set('REQUEST_BATCH_SIZE', 1000000);
    },

    database: {
        /**
         * it export api for domain
         * @param name {string} domain name
         */
        domain<T>(name: string): DomainI<T> {
            return new DomainController<T>(name, _parse, new CacheController(location.hostname));
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
        parseSdk: _parse
    },

    auth: AuthController,

    storage: {
        getInstance(options: {
            fileName: string,
            data: number[] | { base64: string } | { size: number; type: string; } | { uri: string },
            fileType?: string
        }): StorageAdapter {
            return new StorageController(new _parse.File(options.fileName, options.data, options.fileType));
        }
    }

};
