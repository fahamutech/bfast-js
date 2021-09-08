import {DatabaseController} from "./controllers/database.controller";
import {HttpClientController} from "./controllers/http-client.controller";
import {AuthController} from "./controllers/auth.controller";
import {RulesController} from "./controllers/rules.controller";
import {BulkController} from "./controllers/bulk.controller";

export class BfastDatabase {

    constructor(private readonly appName: string,
        private readonly httpClientController: HttpClientController,
        private readonly rulesController: RulesController,
        private readonly authController: AuthController) {
    }

    /**
     * a domain/table/collection to deal with
     * @param domainName {string} domain name
     * @return {DatabaseController}
     */
    domain<T>(domainName: string): DatabaseController {
        return new DatabaseController(
            domainName,
            this.httpClientController,
            this.rulesController,
            this.authController,
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
     * perform bulk to remote database
     * @return {BulkController}
     */
    bulk(): BulkController {
        return new BulkController(
            this.appName, 
            this.httpClientController, 
            this.rulesController,
            this.authController
        );
    }
}
