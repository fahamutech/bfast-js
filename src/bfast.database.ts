import {DatabaseController} from "./controllers/DatabaseController";
import {CacheController} from "./controllers/CacheController";
import {BFastConfig} from "./conf";
import {AxiosRestController} from "./controllers/AxiosRestController";
import {AuthController} from "./controllers/AuthController";
import {RulesController} from "./controllers/RulesController";
import {TransactionController} from "./controllers/TransactionController";

export class BfastDatabase {

    constructor(private readonly appName: string) {
    }

    /**
     * a domain/table/collection to deal with
     * @param domainName {string} domain name
     * @return {DatabaseController}
     */
    domain<T>(domainName: string): DatabaseController {
        const authCache = new CacheController(
            this.appName,
            BFastConfig.getInstance().getCacheDatabaseName(BFastConfig.getInstance().DEFAULT_AUTH_CACHE_DB_NAME(), this.appName),
            BFastConfig.getInstance().getCacheCollectionName('cache', this.appName)
        );
        const restController = new AxiosRestController()
        const authController = new AuthController(restController, authCache, this.appName);
        const rulesController = new RulesController(authController)
        return new DatabaseController(
            domainName,
            restController,
            authController,
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
        const authCache = new CacheController(
            this.appName,
            BFastConfig.getInstance().getCacheDatabaseName(BFastConfig.getInstance().DEFAULT_AUTH_CACHE_DB_NAME(), this.appName),
            BFastConfig.getInstance().getCacheCollectionName('cache', this.appName)
        );
        const restController = new AxiosRestController();
        const authController = new AuthController(restController, authCache, this.appName);
        const rulesController = new RulesController(authController);
        return new TransactionController(this.appName, restController, rulesController);
    }
}
