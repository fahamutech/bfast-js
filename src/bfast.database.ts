import {DatabaseController} from "./controllers/database.controller";
import {HttpClientController} from "./controllers/http-client.controller";
import {AuthController} from "./controllers/auth.controller";
import {RulesController} from "./controllers/rules.controller";
import {BulkController} from "./controllers/bulk.controller";
import {SyncsController} from "./controllers/syncs.controller";

export class BfastDatabase {

    constructor(private readonly appName: string,
        private readonly httpClientController: HttpClientController,
        private readonly rulesController: RulesController,
        private readonly authController: AuthController) {
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

    tree(name: string): DatabaseController{
        return this.domain(name);
    }

    syncs(name: string): SyncsController {
        return new SyncsController(
            name,
            this.tree(name),
            this.appName
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
