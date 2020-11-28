import {AppCredentials, BFastConfig} from "./conf";
import {StorageController} from "./controllers/StorageController";
import {AuthController} from "./controllers/AuthController";
import {CacheController} from "./controllers/CacheController";
import {AxiosRestController} from "./controllers/AxiosRestController";
import {RulesController} from "./controllers/RulesController";
import {BfastDatabase} from "./bfast.database";
import {BfastFunctions} from "./bfast.functions";


/**
 * Created and maintained by Fahamu Tech Ltd Company
 * @maintained Fahamu Tech ( fahamutechdevelopers@gmail.com )
 */



export class BFast {

    /**
     *
     * @param options
     * @param appName {string} application name for multiple apps access
     */
    static init(options: AppCredentials, appName: string = BFastConfig.DEFAULT_APP) {
        options.cache = {
            enable: false,
        }
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
            ? config.cacheDatabaseName(options.database, appName)
            : config.cacheDatabaseName(config.DEFAULT_CACHE_DB_NAME(), appName);
        const collectionName = (options && options.collection)
            ? config.cacheCollectionName(options.collection, appName)
            : config.cacheCollectionName('cache', appName);
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
        const axiosRestController = new AxiosRestController();
        const cacheController = new CacheController(
            appName,
            config.cacheDatabaseName(BFastConfig.getInstance().DEFAULT_AUTH_CACHE_DB_NAME(), appName),
            config.cacheCollectionName('user', appName),
            config.cacheAdapter(appName)
        );
        return new AuthController(
            appName,
            axiosRestController,
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
    }

    /**
     * access to storage instance from your bfast::database project
     * @param appName
     */
    static storage(appName = BFastConfig.DEFAULT_APP): StorageController {
        const config = BFastConfig.getInstance();
        const authCache = new CacheController(
            appName,
            config.cacheDatabaseName(BFastConfig.getInstance().DEFAULT_AUTH_CACHE_DB_NAME(), appName),
            config.cacheCollectionName('cache', appName),
            config.cacheAdapter(appName)
        );
        const restController = new AxiosRestController()
        const authController = new AuthController(appName, restController, authCache, config.authAdapter(appName));
        const rulesController = new RulesController(authController)
        return new StorageController(new AxiosRestController(), authController, rulesController, appName);
    }

}

export const bfast = BFast
