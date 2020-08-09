import {CacheAdapter} from "../adapters/CacheAdapter";
import {RequestOptions} from "../adapters/QueryAdapter";
import {HttpClientAdapter} from "../adapters/HttpClientAdapter";
import {BFastConfig} from "../conf";
import {QueryBuilder} from "./QueryBuilder";
import {PipelineBuilder} from "./PipelineBuilder";
import {RulesController} from "./RulesController";

export class QueryController {

    constructor(private readonly collectionName: string,
                private readonly restAdapter: HttpClientAdapter,
                private readonly rulesController: RulesController,
                private readonly appName: string) {
        this.collectionName = collectionName;
    }

    async aggregate<V = any>(pipeline: PipelineBuilder, options: RequestOptions): Promise<V> {
        const aggregateRule = await this.rulesController.aggregateRule(this.collectionName, pipeline,
            BFastConfig.getInstance().getAppCredential(this.appName), options);
        return this.aggregateRuleRequest(aggregateRule);
    }

    async get(objectId: string, options?: RequestOptions): Promise<any> {
        return this.find(new QueryBuilder().byId(objectId), options);
    }

    async find<T>(query: QueryBuilder, options?: RequestOptions): Promise<T[]> {
        const queryRule = await this.rulesController.queryRule(this.collectionName, query,
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
        if (data && data[`query${this.collectionName}`]) {
            return data[`query${this.collectionName}`];
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
        if (data && data[`aggregate${this.collectionName}`]) {
            return data[`aggregate${this.collectionName}`];
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
