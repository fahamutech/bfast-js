import {RequestOptions} from "../adapters/QueryAdapter";
import {HttpClientAdapter} from "../adapters/HttpClientAdapter";
import {BFastConfig} from "../conf";
import {RulesController} from "./RulesController";
import {SocketController} from "./SocketController";
import {DatabaseChangesController, DatabaseController} from "./DatabaseController";
import {QueryModel} from "../model/QueryModel";
import {UpdateController} from "./UpdateController";

export enum QueryOrder {
    ASCENDING = 1,
    DESCENDING = -1
}

export class QueryController {
    private query: QueryModel = {
        filter: {},
        return: [],
        skip: 0,
        size: 100,
        orderBy: [{'createdAt': -1}],
        count: false,
    }

    constructor(private readonly domain: string,
                private readonly restAdapter: HttpClientAdapter,
                private readonly rulesController: RulesController,
                private readonly appName: string) {
    }

    byId(id: string): QueryController {
        this.query.id = id;
        return this;
    }

    count(countQuery = false): QueryController {
        this.query.count = countQuery;
        return this;
    }

    size(size: number): QueryController {
        this.query.size = size;
        return this;
    }

    skip(skip: number): QueryController {
        this.query.skip = skip;
        return this;
    }

    orderBy(field: string, order: QueryOrder): QueryController {
        const orderBySet = new Set(this.query.orderBy).add({
            [field]: order
        });
        this.query.orderBy = Array.from(orderBySet);
        return this;
    }

    equalTo(field: string, value: any): QueryController {
        Object.assign(this.query.filter, {
            [field]: {
                $eq: value
            }
        });
        return this;
    }

    notEqualTo(field: string, value: any): QueryController {
        Object.assign(this.query.filter, {
            [field]: {
                $ne: value
            }
        });
        return this;
    }

    greaterThan(field: string, value: any): QueryController {
        Object.assign(this.query.filter, {
            [field]: {
                $gt: value
            }
        });
        return this;
    }

    greaterThanOrEqual(field: string, value: any): QueryController {
        Object.assign(this.query.filter, {
            [field]: {
                $gte: value
            }
        });
        return this;
    }

    includesIn(field: string, value: any[]): QueryController {
        Object.assign(this.query.filter, {
            [field]: {
                $in: value
            }
        });
        return this;
    }

    notIncludesIn(field: string, value: any[]): QueryController {
        Object.assign(this.query.filter, {
            [field]: {
                $nin: value
            }
        });
        return this;
    }

    lessThan(field: string, value: any[]): QueryController {
        Object.assign(this.query.filter, {
            [field]: {
                $lt: value
            }
        });
        return this;
    }

    lessThanOrEqual(field: string, value: any[]): QueryController {
        Object.assign(this.query.filter, {
            [field]: {
                $lte: value
            }
        });
        return this;
    }

    exists(field: string, value = true): QueryController {
        Object.assign(this.query.filter, {
            [field]: {
                $exists: value
            }
        });
        return this;
    }

    searchByRegex(field: string, regex: string): QueryController {
        Object.assign(this.query.filter, {
            [field]: {
                $regex: regex
            }
        });
        return this;
    }

    fullTextSearch(field: string, text: {
        search: string,
        language?: string,
        caseSensitive?: boolean,
        diacriticSensitive?: boolean
    }): QueryController {
        Object.assign(this.query.filter, {
            $text: {
                $search: text.search,
                $language: text.language,
                $caseSensitive: text.caseSensitive,
                $diacriticSensitive: text.diacriticSensitive
            }
        });
        return this;
    }

    raw(query: any): QueryController {
        Object.assign(this.query.filter, query);
        return this;
    }

    private buildQuery(): QueryModel {
        return this.query;
    }

    async delete<T>(options?: RequestOptions): Promise<T> {
        const deleteRule = await this.rulesController.deleteRule(this.domain, this.buildQuery(),
            BFastConfig.getInstance().getAppCredential(this.appName), options);
        const response = await this.restAdapter.post(BFastConfig.getInstance().databaseURL(this.appName), deleteRule);
        return DatabaseController._extractResultFromServer(response.data, 'delete', this.domain);
    }

    updateBuilder(): UpdateController {
        return new UpdateController(
            this.domain,
            this.buildQuery(),
            this.appName,
            this.restAdapter,
            this.rulesController
        );
    }

    changes(onConnect?: () => void, onDisconnect?: () => void): DatabaseChangesController {
        const socketController = new SocketController('/__changes__', this.appName, onConnect, onDisconnect);
        const applicationId = BFastConfig.getInstance().getAppCredential(this.appName).applicationId;
        let match: any;
        if (this.buildQuery() && typeof this.buildQuery().filter === "object") {
            match = this.buildQuery().filter as object;
            Object.keys(match).forEach(key => {
                match[`fullDocument.${key}`] = match[key];
                delete match[key];
            });
        }
        socketController.emit({
            auth: {applicationId: applicationId},
            body: {
                domain: this.domain, pipeline: match ? [{$match: match}] : []
            }
        });
        return new DatabaseChangesController(socketController);
    }

    // ********* need improvement ************ //
    async aggregate<V = any>(pipeline: any[], options: RequestOptions): Promise<V> {
        const aggregateRule = await this.rulesController.aggregateRule(this.domain, pipeline,
            BFastConfig.getInstance().getAppCredential(this.appName), options);
        return this.aggregateRuleRequest(aggregateRule);
    }

    async find<T>(options?: RequestOptions): Promise<T> {
        const queryRule = await this.rulesController.queryRule(this.domain, this.buildQuery(),
            BFastConfig.getInstance().getAppCredential(this.appName), options);
        // const identifier = `find_${this.collectionName}_${JSON.stringify(queryModel && queryModel.filter ? queryModel.filter : {})}`;
        // const cacheResponse = await this.cacheAdapter.get<T[]>(identifier);
        // if (this.cacheAdapter.cacheEnabled(options) && (cacheResponse != undefined || cacheResponse !== null)) {
        //     this.queryRuleRequest(queryRule)
        //         .then(value => {
        //             if (options && options.freshDataCallback) {
        //                 options.freshDataCallback({identifier, data: value});
        //             }
        //             return this.cacheAdapter.set<T[]>(identifier, value);
        //         })
        //         .catch();
        //     return cacheResponse;
        // } else {
        //  this.cacheAdapter.set<T[]>(identifier, response).catch();
        return await this.queryRuleRequest(queryRule);
        // }
    }

    async queryRuleRequest(queryRule: any): Promise<any> {
        const response = await this.restAdapter.post(BFastConfig.getInstance().databaseURL(this.appName), queryRule);
        const data = response.data;
        if (data && data[`query${this.domain}`]) {
            return data[`query${this.domain}`];
        } else {
            const errors = data.errors;
            let queryError: any = {message: "Query not succeed"};
            Object.keys(errors).forEach(value => {
                if (value.includes('query')) {
                    queryError = errors[value];
                }
            });
            queryError['errors'] = errors;
            throw queryError;
        }
    }

    async aggregateRuleRequest(pipelineRule: any): Promise<any> {
        const response = await this.restAdapter.post(BFastConfig.getInstance().databaseURL(this.appName), pipelineRule);
        const data = response.data;
        if (data && data[`aggregate${this.domain}`]) {
            return data[`aggregate${this.domain}`];
        } else {
            const errors = data.errors;
            let aggregateError: any = {message: "Aggregation not succeed"};
            Object.keys(errors).forEach(value => {
                if (value.includes('aggregate')) {
                    aggregateError = errors[value];
                }
            });
            aggregateError['errors'] = errors;
            throw aggregateError;
        }
    }

}
