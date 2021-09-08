import {AppCredentials, BFastConfig} from "./conf";
import {StorageController} from "./controllers/storage.controller";
import {AuthController} from "./controllers/auth.controller";
import {CacheController} from "./controllers/cache.controller";
import {HttpClientController} from "./controllers/http-client.controller";
import {RulesController} from "./controllers/rules.controller";
import {BfastDatabase} from "./bfast.database";
import {BfastFunctions} from "./bfast.functions";
import {cacheAdapter} from "./factories/cache-adapter.factory";
import {httpAdapter} from "./factories/http-adapter.factory";
import {authAdapter} from "./factories/auth-adapter.factory";


/**
 * Created and maintained by FahamuTech Ltd Company
 * @maintained FahamuTech ( fahamutechdevelopers@gmail.com )
 */

/**
 *
 * @param options
 * @param appName {string} application name for multiple apps access
 */
export function init(options: AppCredentials, appName: string = BFastConfig.DEFAULT_APP) {
    BFastConfig.getInstance().setCredential(options, appName);
}

/**
 * get configuration  of a specific app
 * @param appName
 */
export function getConfig(appName = BFastConfig.DEFAULT_APP): BFastConfig {
    return BFastConfig.getInstance();
}

/**
 *
 * @param appName other app/project name other than DEFAULT to work with
 * @return BfastDatabase - Controller for perming database operations
 */
export function database(appName: string = BFastConfig.DEFAULT_APP): BfastDatabase {
    const config = BFastConfig.getInstance();
    const authCache = new CacheController(
        appName,
        config.DEFAULT_CACHE_DB_BFAST,
        config.DEFAULT_CACHE_COLLECTION_USER,
        cacheAdapter(config, appName)
    );
    const restController = new HttpClientController(
        appName,
        httpAdapter(config, appName)
    )
    const authController = new AuthController(appName, authCache, authAdapter(config, appName));
    const rulesController = new RulesController(authController)
    return new BfastDatabase(appName, restController, rulesController, authController);
}

/**
 *
 * @param appName other app/project name to work with
 */
export function functions(appName = BFastConfig.DEFAULT_APP): BfastFunctions {
    // @ts-ignore
    return new BfastFunctions(appName, null, null);
}

/**
 * get cache instance to work with when work in a browser
 * @param options
 * @param appName other app/project name to work with
 */
export function cache(options?: { database: string, collection: string }, appName = BFastConfig.DEFAULT_APP): CacheController {
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
        cacheAdapter(config, appName)
    );
}

/**
 * get auth instance to work with authentication and authorization
 * @param appName other app/project name to work with
 */
export function auth(appName = BFastConfig.DEFAULT_APP) {
    const config = BFastConfig.getInstance();
    const cacheController = new CacheController(
        appName,
        config.DEFAULT_CACHE_DB_BFAST,
        config.DEFAULT_CACHE_COLLECTION_USER,
        cacheAdapter(config, appName)
    );
    return new AuthController(
        appName,
        cacheController,
        authAdapter(config, appName)
    );
}

/**
 * access to storage instance from your bfast::database project
 * @param appName
 */
export function storage(appName = BFastConfig.DEFAULT_APP): StorageController {
    const config = BFastConfig.getInstance();
    const authCacheController = new CacheController(
        appName,
        config.DEFAULT_CACHE_DB_BFAST,
        config.DEFAULT_CACHE_COLLECTION_USER,
        cacheAdapter(config, appName)
    );
    const authController = new AuthController(
        appName,
        authCacheController,
        authAdapter(config, appName)
    );
    const rulesController = new RulesController(authController)
    return new StorageController(
        new HttpClientController(
            appName,
            httpAdapter(config, appName)
        ),
        authController,
        rulesController,
        authController,
        appName
    );
}
