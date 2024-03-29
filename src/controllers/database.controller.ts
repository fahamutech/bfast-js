import {QueryController, RequestOptions} from "./query.controller";
import {RulesController} from "./rules.controller";
import {HttpClientController} from "./http-client.controller";
import {AuthController} from "./auth.controller";
import {extractResultFromServer} from "../utils/data.util";
import {AggregateController} from "./aggregate.controller";
import {getConfig} from '../bfast';

export class DatabaseController {

    constructor(private readonly domainName: string,
                private readonly httpClientController: HttpClientController,
                private readonly rulesController: RulesController,
                private readonly authController: AuthController,
                private readonly appName: string) {
    }

    async save<T>(
        model: T | T[],
        options?: RequestOptions
    ): Promise<T> {
        const credential = getConfig().credential(this.appName);
        const createRule = await this.rulesController.createRule(this.domainName, model, credential, options);
        const response = await this.httpClientController.post(
            `${getConfig().databaseURL(this.appName)}`,
            createRule,
            {
                headers: {}
            },
            {
                context: this.domainName,
                rule: `create${this.domainName}`,
                type: 'daas',
                token: await this.authController.getToken()
            }
        );
        return extractResultFromServer(response.data, 'create', this.domainName);
    }

    async getAll<T>(
        query?: { size?: number, skip?: number, hashes?: string[], cids?: boolean },
        options?: RequestOptions
    ): Promise<T[]> {
        try {
            const totalCount = query && query.size ? query.size : await this.query().count(true).find(options);
            return await this.query()
                .skip(query && query.skip ? query.skip : 0)
                .size(totalCount as number)
                // .cids(query && query.cids ? query.cids : false)
                .hashes(query && query.hashes ? query.hashes : [])
                .find(options);
        } catch (e) {
            throw {message: DatabaseController._getErrorMessage(e ? e : 'unknown error')};
        }
    }

    async get<T>(
        id: string,
        // cids = false,
        options?: RequestOptions
    ): Promise<T> {
        return this.query()
            .byId(id)
            .hashes([])
            // .cids(cids)
            .find<T>(options);
    }

    query(): QueryController {
        return new QueryController(
            this.domainName,
            this.httpClientController,
            this.rulesController,
            this.authController,
            this.appName);
    }

    aggregate(): AggregateController{
        return new AggregateController(
            this.domainName,
            this.httpClientController,
            this.rulesController,
            this.authController,
            this.appName
        );
    }


    static _getErrorMessage(e: any) {
        if (e.message) {
            return e.message;
        } else {
            return (e && e.response && e.response.data) ? e.response.data : e.toString();
        }
    }
}
