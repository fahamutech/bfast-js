// import {BaseAttributes, GeoPoint, LiveQuerySubscription, Object, Pointer, Query} from "parse";
//
// export interface QueryAdapter {
//     and(...args: Array<Query>): Query;
//
//     fromJSON(className: string, json: any): Query;
//
//     nor(...args: Array<Query>): Query;
//
//     or(...var_args: Array<Query>): Query;
//
//     addAscending(key: any | any[]): Query;
//
//     addDescending(key: any | any[]): Query;
//
//     ascending(key: any | any[]): Query;
//
//     aggregate<V = any>(pipeline: Query.AggregationOptions | Query.AggregationOptions[]): Promise<V>;
//
//     containedBy(key: any, values: any[] | string[] | never): Query;
//
//     containedIn(key: any, values: any[] | string | never): Query;
//
//     contains(key: any, substring: string): Query;
//
//     containsAll(key: any, values: any[]): Query;
//
//     containsAllStartingWith(key: any, values: any[]): Query;
//
//     count(options?: Query.CountOptions): Promise<number>;
//
//     descending(key: any | any[]): Query;
//
//     doesNotExist(key: any): Query;
//
//     // doesNotMatchKeyInQuery(key: any, queryKey: any, query: Query): Query;
//
//     // doesNotMatchQuery<U extends Object, K extends keyof T['attributes']>(key: K, query: Query): this;
//
//     distinct(key: any): Promise<any>;
//
//     // each(callback: (obj: T) => PromiseLike<void> | void, options?: Query.EachOptions): Promise<void>;
//
//     endsWith(key: any, suffix: string): Query;
//
//     equalTo(key: any, value: any): Query;
//
//     exists(key: any): Query;
//
//     find(options?: Query.FindOptions): Promise<any[]>;
//
//     first(options?: Query.FirstOptions): Promise<T | undefined>;
//
//     fromLocalDatastore(): void;
//
//     fromPin(): void;
//
//     fromPinWithName(name: string): void;
//
//     fullText(key: K, value: string, options?: Query.FullTextOptions): this;
//
//     get(objectId: string, options?: Query.GetOptions): Promise<T>;
//
//     greaterThan(key: K, value: T['attributes'][K]): this;
//
//     greaterThanOrEqualTo(key: K, value: T['attributes'][K]): this;
//
//     include(key: K | K[]): this;
//
//     includeAll(): Query<T>;
//
//     lessThan(key: K, value: T['attributes'][K]): this;
//
//     lessThanOrEqualTo(key: K, value: T['attributes'][K]): this;
//
//     limit(n: number): Query<T>;
//
//     matches(key: K, regex: RegExp, modifiers?: string): this;
//
//     matchesKeyInQuery<U extends Object, K extends keyof T['attributes'], X extends Extract<keyof U['attributes'], string>>(key: K, queryKey: X, query: Query): this;
//
//     matchesQuery<U extends Object, K extends keyof T['attributes']>(key: K, query: Query): this;
//
//     near(key: K, point: GeoPoint): this;
//
//     notContainedIn(key: K, values: Array<T['attributes'][K]>): this;
//
//     notEqualTo(key: K, value: T['attributes'][K]): this;
//
//     polygonContains(key: K, point: GeoPoint): this;
//
//     select(...keys: K[]): this;
//
//     skip(n: number): Query<T>;
//
//     sortByTextScore(): this;
//
//     startsWith(key: K, prefix: string): this;
//
//     subscribe(): Promise<LiveQuerySubscription>;
//
//     toJSON(): any;
//
//     withJSON(json: any): this;
//
//     withinGeoBox(key: K, southwest: GeoPoint, northeast: GeoPoint): this;
//
//     withinKilometers(key: K, point: GeoPoint, maxDistance: number): this;
//
//     withinMiles(key: K, point: GeoPoint, maxDistance: number): this;
//
//     withinPolygon(key: K, points: number[][]): this;
//
//     withinRadians(key: K, point: GeoPoint, maxDistance: number): this;
// }
