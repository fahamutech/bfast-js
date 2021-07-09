import {AppCredentials, BFastConfig} from "./conf";
import {StorageController} from "./controllers/storage.controller";
import {AuthController} from "./controllers/auth.controller";
import {CacheController} from "./controllers/cache.controller";
import {HttpClientController} from "./controllers/http-client.controller";
import {RulesController} from "./controllers/rules.controller";
import {BfastDatabase} from "./bfast.database";
import {BfastFunctions} from "./bfast.functions";


/**
 * Created and maintained by Fahamu Tech Ltd Company
 * @maintained Fahamu Tech ( fahamutechdevelopers@gmail.com )
 */


export class bfast {

    /**
     *
     * @param options
     * @param appName {string} application name for multiple apps access
     */
    static init(options: AppCredentials, appName: string = BFastConfig.DEFAULT_APP) {
        BFastConfig.getInstance().setCredential(options, appName);
    }

    /**
     * get configuration  of a specific app
     * @param appName
     */
    static getConfig(appName = BFastConfig.DEFAULT_APP): AppCredentials {
        return BFastConfig.getInstance().credential(appName);
    }

    /**
     *
     * @param appName other app/project name other than DEFAULT to work with
     * @return BfastDatabase - Controller for perming database operations
     */
    static database(appName: string = BFastConfig.DEFAULT_APP): BfastDatabase {
        return new BfastDatabase(appName);
    }

    /**
     *
     * @param appName other app/project name to work with
     */
    static functions(appName = BFastConfig.DEFAULT_APP): BfastFunctions {
        return new BfastFunctions(appName);
    }

    /**
     * get cache instance to work with when work in a browser
     * @param options
     * @param appName other app/project name to work with
     */
    static cache(options?: { database: string, collection: string }, appName = BFastConfig.DEFAULT_APP): CacheController {
        const config = BFastConfig.getInstance();
        const databaseName = (options && options.database)
            ? options.database
            : config.DEFAULT_CACHE_DB_BFAST;
        const collectionName = (options && options.collection)
            ? options.collection
            : config.DEFAULT_CACHE_COLLECTION_CACHE;
        return new CacheController(
            appName,
            databaseName,
            collectionName,
            config.cacheAdapter(appName)
        );
    }

    /**
     * get auth instance to work with authentication and authorization
     * @param appName other app/project name to work with
     */
    static auth(appName = BFastConfig.DEFAULT_APP) {
        const config = BFastConfig.getInstance();
        const cacheController = new CacheController(
            appName,
            config.DEFAULT_CACHE_DB_AUTH,
            config.DEFAULT_CACHE_COLLECTION_USER,
            config.cacheAdapter(appName)
        );
        return new AuthController(
            appName,
            cacheController,
            config.authAdapter(appName)
        );
    }

    /**
     * utils and enums
     */
    static utils = {
        USER_DOMAIN_NAME: '_User',
        POLICY_DOMAIN_NAME: '_Policy',
        TOKEN_DOMAIN_NAME: '_Token',
        CURRENT_USER_IDENTIFIER: '_current_user_'
    }

    /**
     * access to storage instance from your bfast::database project
     * @param appName
     */
    static storage(appName = BFastConfig.DEFAULT_APP): StorageController {
        const config = BFastConfig.getInstance();
        const authCacheController = new CacheController(
            appName,
            config.DEFAULT_CACHE_DB_BFAST,
            config.DEFAULT_CACHE_COLLECTION_USER,
            config.cacheAdapter(appName)
        );
        const authController = new AuthController(
            appName,
            authCacheController,
            config.authAdapter(appName)
        );
        const rulesController = new RulesController(authController)
        return new StorageController(
            new HttpClientController(
                appName,
                config.httpAdapter(appName)
            ),
            authController,
            rulesController,
            appName
        );
    }

}

export const BFast = bfast

export default bfast;
