import {BFastConfig} from "./conf";
import {DomainController} from "./controllers/domainController";
import {FunctionController} from "./controllers/functionController";
import {StorageController} from "./controllers/StorageController";
import {DomainI} from "./core/domainInterface";
import {FunctionAdapter} from "./core/functionInterface";
import {StorageAdapter} from "./core/storageAdapter";
import * as _parse from 'parse';
import {AuthController} from "./controllers/AuthController";
import {SocketController} from "./controllers/SocketController";
import {TransactionAdapter} from "./core/TransactionAdapter";
import {TransactionController} from "./controllers/TransactionController";
import {RealTimeAdapter} from "./core/RealTimeAdapter";

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
    }) {
        BFastConfig.getInstance().cloudDatabaseUrl = options.cloudDatabaseUrl ? options.cloudDatabaseUrl : '';
        BFastConfig.getInstance().token = options.token ? options.token : '';
        BFastConfig.getInstance().cloudFunctionsUrl = options.cloudFunctionsUrl ? options.cloudFunctionsUrl : '';
        BFastConfig.getInstance().applicationId = options.applicationId;
        BFastConfig.getInstance().projectId = options.projectId;

        _parse.initialize(BFastConfig.getInstance().applicationId);
        // @ts-ignore
        _parse.serverURL = BFastConfig.getInstance().getCloudDatabaseUrl();
        _parse.CoreManager.set('REQUEST_BATCH_SIZE', 1000000);
    },

    database: {
        /**
         * it export api for domain
         * @param name {string} domain name
         */
        domain(name: string): DomainI {
            return new DomainController(name, _parse);
        },

        /**
         * same as #domain
         */
        collection(collectionName: string): DomainI {
            return this.domain(collectionName);
        },
        /**
         * same as #domain
         */
        table(tableName: string): DomainI {
            return this.domain(tableName);
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
