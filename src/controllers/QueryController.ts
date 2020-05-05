import {DomainModel} from "../adapters/DomainAdapter";
import {CacheAdapter} from "../adapters/CacheAdapter";
import {FindOptionsWithCacheOptions, QueryAdapter} from "../adapters/QueryAdapter";
import {FunctionAdapter} from "../adapters/FunctionsAdapter";

export class QueryController<T extends DomainModel> implements QueryAdapter<T> {

    private readonly where = {};

    constructor(private readonly collectionName: string,
                private readonly cacheAdapter: CacheAdapter,
                private readonly restAdapter: FunctionAdapter,
                private readonly appName: string) {
        this.collectionName = collectionName;
    }

    and(...args: QueryAdapter<T>[]): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    fromJSON(json: any): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    nor(...args: QueryAdapter<T>[]): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    or(...var_args: QueryAdapter<T>[]): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    addAscending<K>(key: K | K[]): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    addDescending<K>(key: K | K[]): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    ascending<K>(key: K | K[]): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    aggregate<V = any>(pipeline: import("../adapters/QueryAdapter").AggregationOptions | import("../adapters/QueryAdapter").AggregationOptions[]): Promise<V> {
        throw new Error("Method not implemented.");
    }
    containedBy<K, V>(key: K, values: string[] | V[]): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    containedIn<K, V>(key: K, values: string | V[]): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    contains<K>(key: K, substring: string): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    containsAll<K, V>(key: K, values: V[]): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    containsAllStartingWith<K, V>(key: K, values: V[]): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    descending<K>(key: K | K[]): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    doesNotExist<K>(key: K): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    endsWith<K>(key: K, suffix: string): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    equalTo<K, V>(key: K, value: V): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    exists<K>(key: K): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    fullText<K>(key: K, value: string, options?: FullTextOptions | undefined): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    greaterThan<K, V>(key: K, value: V): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    greaterThanOrEqualTo<K, V>(key: K, value: V): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    include<K>(key: K | K[]): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    includeAll(): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    lessThan<K, V>(key: K, value: V): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    lessThanOrEqualTo<K, V>(key: K, value: V): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    limit(n: number): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    matches<K>(key: K, regex: RegExp, modifiers?: string | undefined): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    notContainedIn<K, V>(key: K, values: V[]): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    notEqualTo<K, V>(key: K, value: V[]): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    select<K>(...keys: K[]): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    skip(n: number): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    sortByTextScore(): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    startsWith<K>(key: K, prefix: string): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }
    withJSON(json: any): QueryAdapter<T> {
        throw new Error("Method not implemented.");
    }

    toJSON(): any {
        return this.where;
    }

    async count(options?: FindOptionsWithCacheOptions): Promise<number> {
        try {
            const identifier = `count_${this.collectionName}_${JSON.stringify(this.toJSON())}`;
            if (this.cacheAdapter.cacheEnabled(options)) {
                const cacheResponse = await this.cacheAdapter.get<number>(identifier);
                if (cacheResponse) {
                    // super.count(options).then(value => {
                    //     const data = JSON.parse(JSON.stringify(value));
                    //     if (options && options.freshData) {
                    //         options.freshData({identifier, data});
                    //     }
                    //     return this.cacheAdapter
                    //         .set<number>(identifier, data);
                    // }).catch();
                    return cacheResponse;
                }
            }
            // const response = JSON.parse(JSON.stringify(await super.count(options)));
            // this.cacheAdapter.set<number>(identifier, response).catch();
            // return response;
        } catch (e) {
            throw e;
        }
    }

    async get(objectId: string, options?: FindOptionsWithCacheOptions): Promise<any> {
        try {
            const identifier = objectId;
            if (this.cacheAdapter.cacheEnabled(options)) {
                const cacheResponse = await this.cacheAdapter.get<T>(identifier);
                if (cacheResponse) {
                    // super.get(objectId, options).then(value => {
                    //     const data = JSON.parse(JSON.stringify(value));
                    //     if (options && options.freshData) {
                    //         options.freshData({identifier, data});
                    //     }
                    //     return this.cacheAdapter
                    //         .set<T>(identifier, data);
                    // }).catch();
                    return cacheResponse;
                }
            }
            // const response = JSON.parse(JSON.stringify(await super.get(objectId, options)));
            // this.cacheAdapter.set<T>(identifier, response).catch();
            // return response;
        } catch (e) {
            throw e;
        }
    }


    async distinct<T>(key: any, options?: FindOptionsWithCacheOptions): Promise<T> {
        try {
            const identifier = `distinct_${this.collectionName}_${JSON.stringify(this.toJSON())}`;
            if (this.cacheAdapter.cacheEnabled(options)) {
                const cacheResponse = await this.cacheAdapter.get<T>(identifier);
                if (cacheResponse) {
                    // super.distinct(key).then(value => {
                    //     const data = JSON.parse(JSON.stringify(value));
                    //     if (options && options.freshData) {
                    //         options.freshData({identifier, data});
                    //     }
                    //     return this.cacheAdapter
                    //         .set<T>(identifier, data);
                    // }).catch();
                    // return cacheResponse;
                }
            }
            // const response = JSON.parse(JSON.stringify(await super.distinct(key)));
            // this.cacheAdapter.set<T>(identifier, response).catch();
            // return response;
        } catch (e) {
            throw e;
        }
    }

    async find<T>(options?: FindOptionsWithCacheOptions): Promise<T[]> {
        try {
            const identifier = `find_${this.collectionName}_${JSON.stringify(this.toJSON())}`;
            if (this.cacheAdapter.cacheEnabled(options)) {
                const cacheResponse = await this.cacheAdapter.get<T[]>(identifier);
                if (cacheResponse) {
                    // super.find(options).then(value => {
                    //     const data = JSON.parse(JSON.stringify(value));
                    //     if (options && options.freshData) {
                    //         options.freshData({identifier, data});
                    //     }
                    //     return this.cacheAdapter
                    //         .set<T[]>(identifier, data);
                    // }).catch();
                    // return cacheResponse;
                }
            }
            // const response = JSON.parse(JSON.stringify(await super.find(options)));
            // this.cacheAdapter.set<T[]>(identifier, response).catch();
            // return response;
        } catch (e) {
            throw e;
        }
    }

    async first(options?: FindOptionsWithCacheOptions): Promise<any> {
        // const response = await .first(options);
        // return JSON.parse(JSON.stringify(response));
    }

}