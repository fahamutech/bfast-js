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
     * @return AppCredentials of current init project
     */
    static init(options: AppCredentials, appName: string = BFastConfig.DEFAULT_APP): AppCredentials {
        options.cache = {
            enable: false,
        }
        return BFastConfig.getInstance(options, appName).getAppCredential(appName);
    }

    /**
     * return a config object
     */
    static getConfig(appName = BFastConfig.DEFAULT_APP, config?: AppCredentials): BFastConfig {
        return BFastConfig.getInstance(config, appName);
    }

    /**
     *
     * @param appName other app/project name from DEFAULT to work with
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
        return new CacheController(
            appName,
            (options && options.database)
                ? BFastConfig.getInstance().getCacheDatabaseName(options.database, appName)
                : BFastConfig.getInstance().getCacheDatabaseName(BFastConfig.getInstance().DEFAULT_CACHE_DB_NAME(), appName),
            (options && options.collection)
                ? BFastConfig.getInstance().getCacheCollectionName(options.collection, appName)
                : BFastConfig.getInstance().getCacheCollectionName('cache', appName),
        );
    }

    /**
     * get auth instance to work with authentication and authorization
     * @param appName other app/project name to work with
     */
    static auth(appName = BFastConfig.DEFAULT_APP) {
        return new AuthController(
            new AxiosRestController(),
            new CacheController(
                appName,
                BFastConfig.getInstance().getCacheDatabaseName(BFastConfig.getInstance().DEFAULT_AUTH_CACHE_DB_NAME(), appName),
                BFastConfig.getInstance().getCacheCollectionName('cache', appName)
            ),
            appName
        );
    }

    /**
     * utils and enums
     */
    static utils = {
        USER_DOMAIN_NAME: '_User',
        POLICY_DOMAIN_NAME: '_Policy',
        TOKEN_DOMAIN_NAME: '_Policy',
    }

    /**
     * access to storage instance from your bfast::database project
     * @param appName
     */
    static storage(appName = BFastConfig.DEFAULT_APP): StorageController {
        const authCache = new CacheController(
            appName,
            BFastConfig.getInstance().getCacheDatabaseName(BFastConfig.getInstance().DEFAULT_AUTH_CACHE_DB_NAME(), appName),
            BFastConfig.getInstance().getCacheCollectionName('cache', appName)
        );
        const restController = new AxiosRestController()
        const authController = new AuthController(restController, authCache, appName);
        const rulesController = new RulesController(authController)
        return new StorageController(new AxiosRestController(), authController, rulesController, appName);
    }

}
