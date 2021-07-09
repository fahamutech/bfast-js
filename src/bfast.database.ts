import {DatabaseController} from "./controllers/database.controller";
import {CacheController} from "./controllers/cache.controller";
import {BFastConfig} from "./conf";
import {HttpClientController} from "./controllers/http-client.controller";
import {AuthController} from "./controllers/auth.controller";
import {RulesController} from "./controllers/rules.controller";
import {TransactionController} from "./controllers/transaction.controller";

export class BfastDatabase {

    constructor(private readonly appName: string) {
    }

    /**
     * a domain/table/collection to deal with
     * @param domainName {string} domain name
     * @return {DatabaseController}
     */
    domain<T>(domainName: string): DatabaseController {
        const config = BFastConfig.getInstance();
        const authCache = new CacheController(
            this.appName,
            config.DEFAULT_CACHE_DB_BFAST,
            config.DEFAULT_CACHE_COLLECTION_USER,
            config.cacheAdapter(this.appName)
        );
        const restController = new HttpClientController(
            this.appName,
            config.httpAdapter(this.appName)
        )
        const authController = new AuthController(this.appName, authCache, config.authAdapter(this.appName));
        const rulesController = new RulesController(authController)
        return new DatabaseController(
            domainName,
            restController,
            rulesController,
            this.appName
        );
    }

    /**
     * same as #domain
     * @return {DatabaseController}
     */
    collection<T>(collectionName: string): DatabaseController {
        return this.domain<T>(collectionName);
    }

    /**
     * same as #domain
     * @return {DatabaseController}
     */
    table<T>(tableName: string): DatabaseController {
        return this.domain<T>(tableName);
    }

    /**
     * perform transaction to remote database
     * @return {TransactionController}
     */
    transaction(): TransactionController {
        const config = BFastConfig.getInstance();
        const authCacheController = new CacheController(
            this.appName,
            config.DEFAULT_CACHE_DB_BFAST,
            config.DEFAULT_CACHE_COLLECTION_USER,
            config.cacheAdapter(this.appName)
        );
        const restController = new HttpClientController(
            this.appName,
            config.httpAdapter(this.appName)
        );
        const authController = new AuthController(this.appName, authCacheController, config.authAdapter(this.appName));
        const rulesController = new RulesController(authController);
        return new TransactionController(this.appName, restController, rulesController);
    }
}
