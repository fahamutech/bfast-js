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

export function init(options: AppCredentials, appName: string = BFastConfig.DEFAULT_APP) {
    BFastConfig.getInstance().setCredential(options, appName);
}
export function getConfig(appName = BFastConfig.DEFAULT_APP): BFastConfig {
    return BFastConfig.getInstance();
}
export function database(appName: string = BFastConfig.DEFAULT_APP): BfastDatabase {
    const config = BFastConfig.getInstance();
    const authCache = new CacheController(
        appName,
        config.DEFAULT_CACHE_DB_BFAST,
        config.DEFAULT_CACHE_COLLECTION_USER,
        cacheAdapter(appName)
    );
    const restController = new HttpClientController(
        appName,
        httpAdapter(config, appName)
    )
    const authController = new AuthController(appName, authCache, authAdapter(config, appName));
    const rulesController = new RulesController()
    return new BfastDatabase(
        appName,
        restController,
        rulesController,
        authController,
        cacheAdapter(appName)
    );
}
export function functions(appName = BFastConfig.DEFAULT_APP): BfastFunctions {
    // @ts-ignore
    return new BfastFunctions(appName, null, null);
}
export function cache(
    options?: { database: string, collection: string },
    appName = BFastConfig.DEFAULT_APP
): CacheController {
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
        cacheAdapter(appName)
    );
}
export function auth(appName = BFastConfig.DEFAULT_APP) {
    const config = BFastConfig.getInstance();
    const cacheController = new CacheController(
        appName,
        config.DEFAULT_CACHE_DB_BFAST,
        config.DEFAULT_CACHE_COLLECTION_USER,
        cacheAdapter(appName)
    );
    return new AuthController(
        appName,
        cacheController,
        authAdapter(config, appName)
    );
}
export function storage(appName = BFastConfig.DEFAULT_APP): StorageController {
    const config = BFastConfig.getInstance();
    const authCacheController = new CacheController(
        appName,
        config.DEFAULT_CACHE_DB_BFAST,
        config.DEFAULT_CACHE_COLLECTION_USER,
        cacheAdapter(appName)
    );
    const authController = new AuthController(
        appName,
        authCacheController,
        authAdapter(config, appName)
    );
    const rulesController = new RulesController()
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
