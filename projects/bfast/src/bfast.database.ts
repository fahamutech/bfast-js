import {DatabaseController} from './controllers/DatabaseController';
import {CacheController} from './controllers/CacheController';
import {BFastConfig} from './conf';
import {AxiosRestController} from './controllers/AxiosRestController';
import {AuthController} from './controllers/AuthController';
import {RulesController} from './controllers/RulesController';
import {TransactionController} from './controllers/TransactionController';

export class BfastDatabase {

  constructor(private readonly appName: string) {
  }

  domain<T>(domainName: string): DatabaseController {
    const config = BFastConfig.getInstance();
    const authCache = new CacheController(
      this.appName,
      config.cacheDatabaseName(BFastConfig.getInstance().DEFAULT_AUTH_CACHE_DB_NAME(), this.appName),
      config.cacheCollectionName('cache', this.appName),
      config.cacheAdapter(this.appName)
    );
    const restController = new AxiosRestController();
    const authController = new AuthController(this.appName, restController, authCache, config.authAdapter(this.appName));
    const rulesController = new RulesController(authController);
    return new DatabaseController(
      domainName,
      restController,
      authController,
      rulesController,
      this.appName
    );
  }

  collection<T>(collectionName: string): DatabaseController {
    return this.domain<T>(collectionName);
  }

  table<T>(tableName: string): DatabaseController {
    return this.domain<T>(tableName);
  }


  transaction(): TransactionController {
    const config = BFastConfig.getInstance();
    const authCache = new CacheController(
      this.appName,
      config.cacheDatabaseName(BFastConfig.getInstance().DEFAULT_AUTH_CACHE_DB_NAME(), this.appName),
      config.cacheCollectionName('cache', this.appName),
      config.cacheAdapter(this.appName)
    );
    const restController = new AxiosRestController();
    const authController = new AuthController(this.appName, restController, authCache, config.authAdapter(this.appName));
    const rulesController = new RulesController(authController);
    return new TransactionController(this.appName, restController, rulesController);
  }
}
