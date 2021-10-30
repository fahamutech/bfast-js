import {DatabaseController} from "./controllers/database.controller";
import {HttpClientController} from "./controllers/http-client.controller";
import {AuthController} from "./controllers/auth.controller";
import {RulesController} from "./controllers/rules.controller";
import {BulkController} from "./controllers/bulk.controller";
import {SyncsController} from "./controllers/syncs.controller";
import {CacheAdapter} from "./adapters/cache.adapter";
import {BFastConfig} from "./conf";

export class BfastDatabase {

    constructor(private readonly appName: string,
                private readonly httpClientController: HttpClientController,
                private readonly rulesController: RulesController,
                private readonly authController: AuthController,
                private readonly cacheAdapter: CacheAdapter,) {
    }

    domain<T>(domainName: string): DatabaseController {
        return new DatabaseController(
            domainName,
            this.httpClientController,
            this.rulesController,
            this.authController,
            this.appName
        );
    }

    collection<T>(collectionName: string): DatabaseController {
        return this.domain<T>(collectionName);
    }

    table<T>(tableName: string): DatabaseController {
        return this.domain<T>(tableName);
    }

    tree(name: string): DatabaseController {
        return this.domain(name);
    }

    syncs(treeName: string, synced?: (syncs: SyncsController) => void): SyncsController {
        return SyncsController.getInstance(
            this.appName,
            treeName,
            BFastConfig.getInstance().credential(this.appName).projectId,
            this.bulk(),
            this.cacheAdapter,
            this.tree(treeName),
            synced
        );
    }

    bulk(): BulkController {
        return new BulkController(
            this.appName,
            this.httpClientController,
            this.rulesController,
            this.authController
        );
    }
}
