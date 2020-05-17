import {QueryModel} from "../model/QueryModel";

export interface QueryAdapter<T> {
    aggregate<V = any>(pipeline: AggregationOptions | AggregationOptions[], options: CacheOptions): Promise<V>;

    count(options?: FindOptionsWithCacheOptions): Promise<number>;

    distinct<K>(key: K, queryModel: QueryModel<T>, options?: FindOptionsWithCacheOptions): Promise<T>;

    find(queryModel: QueryModel<T>, options?: FindOptionsWithCacheOptions): Promise<T[]>;

    first(queryModel: QueryModel<T>, options?: FindOptionsWithCacheOptions): Promise<T | undefined>;

    get(objectId: string, options?: FindOptionsWithCacheOptions): Promise<T>;
}

export interface AggregationOptions {
    group?: { objectId?: string; [key: string]: any };
    match?: { [key: string]: any };
    project?: { [key: string]: any };
    limit?: number;
    skip?: number;
    // Sort documentation https://docs.mongodb.com/v3.2/reference/operator/aggregation/sort/#pipe._S_sort
    sort?: { [key: string]: 1 | -1 };
}

export interface FindOptionsWithCacheOptions extends CacheOptions {
}

export interface CacheOptions {
    /**
     * enable cache in method level, override global option
     */
    cacheEnable: boolean,
    /**
     * cache to expire flag
     */
    dtl: number,

    /**
     * callback to response from network data, just before that data is updated to cache
     * @param identifier {string} cache identifier
     * @param data {T extend object} fresh data from network
     */
    freshDataCallback?: <T>(value: { identifier: string, data: T }) => void;
}

// According to https://parseplatform.org/Parse-SDK-JS/api/2.1.0/Parse.Query.html#fullText
export interface FullTextOptions {
    language?: string;
    caseSensitive?: boolean;
    diacriticSensitive?: boolean;
}
