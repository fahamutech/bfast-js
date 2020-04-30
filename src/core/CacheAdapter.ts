import {Query} from 'parse'

export interface CacheAdapter {
    cacheStoreName: string;

    set<T>(identifier: string, data: T, options?: { dtl: number }): Promise<T>;

    get<T>(identifier: string): Promise<T>;

    clearAll(): Promise<boolean>;

    remove(identifier: string): Promise<boolean>;

    cacheEnabled(options?: CacheOptions): boolean;
}

export interface CacheOptions extends Query.FindOptions {
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
    freshData?: <T>(value: { identifier: string, data: T }) => void;
}

export interface AggregationOptions extends Parse.Query.AggregationOptions {
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