import { AppCredentials, BFastConfig } from "./conf";
import { StorageController } from "./controllers/storage.controller";
import { AuthController } from "./controllers/auth.controller";
import { CacheController } from "./controllers/cache.controller";
import { HttpClientController } from "./controllers/http-client.controller";
import { RulesController } from "./controllers/rules.controller";
import { BfastDatabase } from "./bfast.database";
import { BfastFunctions } from "./bfast.functions";


/**
 * Created and maintained by Fahamu Tech Ltd Company
 * @maintained Fahamu Tech ( fahamutechdevelopers@gmail.com )
 */


// export class bfast {

/**
 *
 * @param options
 * @param appName {string} application name for multiple apps access
 */
export function init(options: AppCredentials, appName: string = BFastConfig.DEFAULT_APP) {
    // options.cache = {
    //     enable: true,
    // }
    BFastConfig.getInstance().setCredential(options, appName);
}

/**
 * get configuration  of a specific app
 * @param appName
 */
export function getConfig(appName = BFastConfig.DEFAULT_APP): AppCredentials {
    return BFastConfig.getInstance().credential(appName);
}

/**
 *
 * @param appName other app/project name other than DEFAULT to work with
 * @return BfastDatabase - Controller for perming database operations
 */
export function database(appName: string = BFastConfig.DEFAULT_APP): BfastDatabase {
    return new BfastDatabase(appName);
}

/**
 *
 * @param appName other app/project name to work with
 */
export function functions(appName = BFastConfig.DEFAULT_APP): BfastFunctions {
    return new BfastFunctions(appName);
}

/**
 * get cache instance to work with when work in a browser
 * @param options
 * @param appName other app/project name to work with
 */
export function cache(options?: { database: string, collection: string }, appName = BFastConfig.DEFAULT_APP): CacheController {
    const config = BFastConfig.getInstance();
    const databaseName = (options && options.database)
        ? config.cacheDatabaseName(options.database, appName)
        : config.cacheDatabaseName(config.DEFAULT_CACHE_DB_NAME, appName);
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
export function auth(appName = BFastConfig.DEFAULT_APP) {
    const config = BFastConfig.getInstance();
    const cacheController = new CacheController(
        appName,
        config.cacheDatabaseName(BFastConfig.getInstance().DEFAULT_CACHE_DB_NAME, appName),
        config.cacheCollectionName('user', appName),
        config.cacheAdapter(appName)
    );
    const httpClientController = new HttpClientController(
        cacheController,
        config.httpAdapter(appName)
    );
    return new AuthController(
        appName,
        httpClientController,
        cacheController,
        config.authAdapter(appName)
    );
}

/**
 * utils and enums
 */
export const utils = {
    USER_DOMAIN_NAME: '_User',
    POLICY_DOMAIN_NAME: '_Policy',
    TOKEN_DOMAIN_NAME: '_Token',
}

/**
 * access to storage instance from your bfast::database project
 * @param appName
 */
export function storage(appName = BFastConfig.DEFAULT_APP): StorageController {
    const config = BFastConfig.getInstance();
    const authCacheController = new CacheController(
        appName,
        config.DEFAULT_CACHE_DB_NAME,
        config.DEFAULT_CACHE_COLLECTION_USER,
        config.cacheAdapter(appName)
    );
    const authController = new AuthController(
        appName,
        new HttpClientController(
            authCacheController,
            config.httpAdapter(appName)
        ),
        authCacheController,
        config.authAdapter(appName)
    );
    const rulesController = new RulesController(authController)
    return new StorageController(
        new HttpClientController(
            new CacheController(
                appName,
                config.DEFAULT_CACHE_DB_NAME,
                config.DEFAULT_CACHE_COLLECTION_STORAGE,
                config.cacheAdapter(appName)
            ),
            config.httpAdapter(appName)
        ),
        authController,
        rulesController,
        appName
    );
}

// }

// export const BFast = bfast

// export default bfast;
