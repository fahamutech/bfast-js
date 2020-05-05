export interface QueryAdapter<T> {
    and(...args: Array<QueryAdapter<T>>): QueryAdapter<T>;

    fromJSON(json: any): QueryAdapter<T>;

    nor(...args: Array<QueryAdapter<T>>): QueryAdapter<T>;

    or(...var_args: Array<QueryAdapter<T>>): QueryAdapter<T>;

    addAscending<K>(key: K | K[]): QueryAdapter<T>;

    addDescending<K>(key: K | K[]): QueryAdapter<T>;

    ascending<K>(key: K | K[]): QueryAdapter<T>;

    aggregate<V = any>(pipeline: AggregationOptions | AggregationOptions[]): Promise<V>;

    containedBy<K, V>(key: K, values: V[] | string[] | never): QueryAdapter<T>;

    containedIn<K, V>(key: K, values: V[] | string | never): QueryAdapter<T>;

    contains<K>(key: K, substring: string): QueryAdapter<T>;

    containsAll<K, V>(key: K, values: V[]): QueryAdapter<T>;

    containsAllStartingWith<K, V>(key: K, values: V[]): QueryAdapter<T>;

    count(options?: FindOptionsWithCacheOptions): Promise<number>;

    descending<K>(key: K | K[]): QueryAdapter<T>;

    doesNotExist<K>(key: K): QueryAdapter<T>;

    distinct<K>(key: K): Promise<T>;

    endsWith<K>(key: K, suffix: string): QueryAdapter<T>;

    equalTo<K, V>(key: K, value: V): QueryAdapter<T>;

    exists<K>(key: K): QueryAdapter<T>;

    find(options?: FindOptionsWithCacheOptions): Promise<T[]>;

    first(options?: FindOptionsWithCacheOptions): Promise<T | undefined>;

    fullText<K>(key: K, value: string, options?: FullTextOptions): QueryAdapter<T>;

    get(objectId: string, options?: FindOptionsWithCacheOptions): Promise<T>;

    greaterThan<K, V>(key: K, value: V): QueryAdapter<T>;

    greaterThanOrEqualTo<K, V>(key: K, value: V): QueryAdapter<T>;

    include<K>(key: K | K[]): QueryAdapter<T>;

    includeAll(): QueryAdapter<T>;

    lessThan<K, V>(key: K, value: V): QueryAdapter<T>;

    lessThanOrEqualTo<K, V>(key: K, value: V): QueryAdapter<T>;

    limit(n: number): QueryAdapter<T>;

    matches<K>(key: K, regex: RegExp, modifiers?: string): QueryAdapter<T>;

    // near<K,>(key: K, point: any): QueryAdapter<T>;

    notContainedIn<K, V>(key: K, values: V[]): QueryAdapter<T>;

    notEqualTo<K, V>(key: K, value: V[]): QueryAdapter<T>;

    // polygonContains<K>(key: K, point: ): this;

    select<K>(...keys: K[]): QueryAdapter<T>;

    skip(n: number): QueryAdapter<T>;

    sortByTextScore(): QueryAdapter<T>;

    startsWith<K>(key: K, prefix: string): QueryAdapter<T>;

    toJSON(): any;

    withJSON(json: any): QueryAdapter<T>;

    // withinGeoBox(key: K, southwest: GeoPoint, northeast: GeoPoint): this;
    //
    // withinKilometers(key: K, point: GeoPoint, maxDistance: number): this;
    //
    // withinMiles(key: K, point: GeoPoint, maxDistance: number): this;
    //
    // withinPolygon(key: K, points: number[][]): this;
    //
    // withinRadians(key: K, point: GeoPoint, maxDistance: number): this;
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
    freshData?: <T>(value: { identifier: string, data: T }) => void;
}

// According to https://parseplatform.org/Parse-SDK-JS/api/2.1.0/Parse.Query.html#fullText
interface FullTextOptions {
    language?: string;
    caseSensitive?: boolean;
    diacriticSensitive?: boolean;
}