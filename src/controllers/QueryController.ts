import {DomainModel} from "../adapters/DomainAdapter";
import {CacheAdapter} from "../adapters/CacheAdapter";
import {AggregationOptions, QueryAdapter, RequestOptions} from "../adapters/QueryAdapter";
import {RestAdapter, RestResponse} from "../adapters/RestAdapter";
import {BFastConfig} from "../conf";
import {QueryModel} from "../model/QueryModel";

export class QueryController<T extends DomainModel> implements QueryAdapter<T> {

    constructor(private readonly collectionName: string,
                private readonly cacheAdapter: CacheAdapter,
                private readonly restAdapter: RestAdapter,
                private readonly appName: string) {
        this.collectionName = collectionName;
    }

    async aggregate<V = any>(pipeline: AggregationOptions | AggregationOptions[], options: RequestOptions): Promise<V> {
        let pipelineToStrings = JSON.stringify(pipeline);
        pipelineToStrings = pipelineToStrings.length > 7 ? pipelineToStrings.substring(0, 7) : pipelineToStrings;
        const identifier = `aggregate_${this.collectionName}_${pipelineToStrings ? pipelineToStrings : ''}`;
        const aggregateReq = (): Promise<RestResponse> => {
            return this.restAdapter.get(
                `${BFastConfig.getInstance().databaseURL(this.appName)}/aggregate/${this.collectionName}`,
                {
                    headers: (options && options.useMasterKey === true)
                        ? BFastConfig.getInstance().getMasterHeaders(this.appName)
                        : BFastConfig.getInstance().getHeaders(this.appName),
                    params: pipeline
                }
            );
        }
        if (this.cacheAdapter.cacheEnabled(options)) {
            const cacheResponse = await this.cacheAdapter.get<V>(identifier);
            if (cacheResponse) {
                aggregateReq().then(value => {
                    const data = value.data.results
                    if (options && options.freshDataCallback) {
                        options.freshDataCallback({identifier, data});
                    }
                    return this.cacheAdapter
                        .set<T>(identifier, data);
                }).catch();
                return cacheResponse;
            }
        }
        const response = await aggregateReq();
        this.cacheAdapter.set<V>(identifier, response.data.results).catch();
        return response.data.results;
    }

    async count(options?: RequestOptions): Promise<number> {
        const countReq = async (): Promise<RestResponse> => {
            return this.restAdapter.get(
                `${BFastConfig.getInstance().databaseURL(this.appName)}/classes/${this.collectionName}`,
                {
                    headers: (options && options.useMasterKey === true)
                        ? BFastConfig.getInstance().getMasterHeaders(this.appName)
                        : BFastConfig.getInstance().getHeaders(this.appName),
                    params: {
                        count: 1,
                        limit: 0
                    }
                }
            );
        }
        const identifier = `count_${this.collectionName}_`;
        if (this.cacheAdapter.cacheEnabled(options)) {
            const cacheResponse = await this.cacheAdapter.get<number>(identifier);
            if (cacheResponse) {
                countReq()
                    .then(value => {
                        const data = value.data.count;
                        if (options && options.freshDataCallback) {
                            options.freshDataCallback({identifier, data});
                        }
                        return this.cacheAdapter.set<number>(identifier, data);
                    })
                    .catch();
                return cacheResponse;
            }
        }
        const response = await countReq();
        this.cacheAdapter.set<number>(identifier, response.data.count).catch();
        return response.data.count;
    }

    async get(objectId: string, options?: RequestOptions): Promise<any> {
        try {
            const identifier = this.collectionName + '_' + objectId;
            const getReq = async (): Promise<RestResponse> => {
                return this.restAdapter.get(
                    `${BFastConfig.getInstance().databaseURL(this.appName)}/classes/${this.collectionName}/${identifier}`,
                    {
                        headers: (options && options.useMasterKey === true)
                            ? BFastConfig.getInstance().getMasterHeaders(this.appName)
                            : BFastConfig.getInstance().getHeaders(this.appName),
                    }
                );
            }
            if (this.cacheAdapter.cacheEnabled(options)) {
                const cacheResponse = await this.cacheAdapter.get<T>(identifier);
                if (cacheResponse) {
                    getReq().then(value => {
                        const data = value.data;
                        if (options && options.freshDataCallback) {
                            options.freshDataCallback({identifier, data});
                        }
                        return this.cacheAdapter.set<T>(identifier, data);
                    }).catch();
                    return cacheResponse;
                }
            }
            const response = await getReq();
            this.cacheAdapter.set<T>(identifier, response.data).catch();
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    async distinct<T>(key: any, queryModel: QueryModel<T>, options?: RequestOptions): Promise<T> {
        const identifier = `distinct_${this.collectionName}_${JSON.stringify(queryModel && queryModel.filter ? queryModel.filter : {})}`;
        const distinctReq = (): Promise<RestResponse> => {
            return this.restAdapter.get(
                `${BFastConfig.getInstance().databaseURL(this.appName)}/aggregate/${this.collectionName}`,
                {
                    headers: BFastConfig.getInstance().getMasterHeaders(this.appName),
                    params: {
                        limit: (queryModel && queryModel.size) ? queryModel.size : 100,
                        skip: (queryModel && queryModel.skip) ? queryModel.skip : 0,
                        order: (queryModel && queryModel.orderBy) ? queryModel.orderBy?.join(',') : '-createdAt',
                        keys: (queryModel && queryModel.keys) ? queryModel.keys?.join(',') : null,
                        where: (queryModel && queryModel.filter) ? queryModel.filter : {},
                        distinct: key
                    }
                }
            );
        }
        if (this.cacheAdapter.cacheEnabled(options)) {
            const cacheResponse = await this.cacheAdapter.get<T>(identifier);
            if (cacheResponse) {
                distinctReq().then(value => {
                    const data = value.data.results
                    if (options && options.freshDataCallback) {
                        options.freshDataCallback({identifier, data});
                    }
                    return this.cacheAdapter
                        .set<T>(identifier, data);
                }).catch();
                return cacheResponse;
            }
        }
        const response = await distinctReq();
        this.cacheAdapter.set<T>(identifier, response.data.results).catch();
        return response.data.results;
    }

    async find<T>(queryModel: QueryModel<T>, options?: RequestOptions): Promise<T[]> {
        const identifier = `find_${this.collectionName}_${JSON.stringify(queryModel && queryModel.filter ? queryModel.filter : {})}`;
        const findReq = (): Promise<RestResponse> => {
            return this.restAdapter.get(
                `${BFastConfig.getInstance().databaseURL(this.appName)}/classes/${this.collectionName}`,
                {
                    headers: (options && options.useMasterKey === true)
                        ? BFastConfig.getInstance().getMasterHeaders(this.appName)
                        : BFastConfig.getInstance().getHeaders(this.appName),
                    params: {
                        limit: (queryModel && queryModel.size) ? queryModel.size : 100,
                        skip: (queryModel && queryModel.skip) ? queryModel.skip : 0,
                        order: (queryModel && queryModel.orderBy) ? queryModel.orderBy?.join(',') : '-createdAt',
                        keys: (queryModel && queryModel.keys) ? queryModel.keys?.join(',') : null,
                        where: (queryModel && queryModel.filter) ? queryModel.filter : {}
                    }
                }
            );
        }
        if (this.cacheAdapter.cacheEnabled(options)) {
            const cacheResponse = await this.cacheAdapter.get<T[]>(identifier);
            if (cacheResponse) {
                findReq()
                    .then(value => {
                        const data = value.data.results;
                        if (options && options.freshDataCallback) {
                            options.freshDataCallback({identifier, data});
                        }
                        return this.cacheAdapter.set<T[]>(identifier, data);
                    })
                    .catch();
                return cacheResponse;
            }
        }
        const response = await findReq();
        this.cacheAdapter.set<T[]>(identifier, response.data.results).catch();
        return response.data.results;
    }

    async first<T>(queryModel: QueryModel<T>, options?: RequestOptions): Promise<T> {
        const identifier = `first_${this.collectionName}_${JSON.stringify(queryModel && queryModel.filter ? queryModel.filter : {})}`;
        const firstReq = (): Promise<RestResponse> => {
            return this.restAdapter.get(
                `${BFastConfig.getInstance().databaseURL(this.appName)}/classes/${this.collectionName}`,
                {
                    headers: (options && options.useMasterKey === true)
                        ? BFastConfig.getInstance().getMasterHeaders(this.appName)
                        : BFastConfig.getInstance().getHeaders(this.appName),
                    params: {
                        limit: 1,
                        skip: 0,
                        order: (queryModel && queryModel.orderBy) ? queryModel.orderBy?.join(',') : '-createdAt',
                        keys: (queryModel && queryModel.keys) ? queryModel.keys?.join(',') : null,
                        where: (queryModel && queryModel.filter) ? queryModel.filter : {}
                    }
                }
            );
        }
        if (this.cacheAdapter.cacheEnabled(options)) {
            const cacheResponse = await this.cacheAdapter.get<T>(identifier);
            if (cacheResponse) {
                firstReq().then(value => {
                    const data = value.data.results;
                    if (options && options.freshDataCallback) {
                        options.freshDataCallback({identifier, data: data.length === 1 ? data[0] : null});
                    }
                    return this.cacheAdapter.set<T>(identifier, data.length === 1 ? data[0] : null);
                }).catch();
                return cacheResponse;
            }
        }
        const response = await firstReq();
        const data = response.data.results;
        this.cacheAdapter.set<T>(identifier, data.length === 1 ? data[0] : null).catch();
        return data.length === 1 ? data[0] : null;
    }

}
