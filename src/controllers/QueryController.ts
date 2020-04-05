import {Query} from 'parse'
// let _parse: any;
// if (typeof window === 'undefined') {
//     _parse = require('parse/node');
// } else {
//     _parse = require('parse');
// }

export class QueryController extends Query {

    private collectionName: string;

    constructor(collectionName: string) {
        super(collectionName);
        this.collectionName = collectionName;
    }

    async distinct(key: any): Promise<any> {
        try {
            const response = await super.distinct(key);
            return JSON.parse(JSON.stringify(response));
        } catch (e) {
            throw e;
        }
    }

    async find(options?: Query.FindOptions): Promise<any[]> {
        try {
            const response = await super.find(options);
            return JSON.parse(JSON.stringify(response));
        } catch (e) {
            throw e;
        }
    }

    // addAscending(key: string[] | string): Query {
    //     return this._parseQuery.addAscending(key);
    // }
    //
    // addDescending(key: string[] | string): Query {
    //     return this._parseQuery.addDescending(key);
    // }
    //
    // aggregate<V = any>(pipeline: Query.AggregationOptions | Query.AggregationOptions[]): Promise<V> {
    //     return this._parseQuery.aggregate(pipeline);
    // }
    //
    // and(...args: Array<Query>): Query {
    //     return Query.and(...args);
    // }
    //
    // ascending(key: string[] | string): Query {
    //     return this._parseQuery.ascending(key);
    // }
    //
    // containedBy(key: any, values: any[] | string[] | never): Query {
    //     return this._parseQuery.containedBy(key, values);
    // }
    //
    // containedIn(key: any, values: any[] | string[] | never): Query {
    //     return this._parseQuery.containedIn(key, values);
    // }
    //
    // contains(key: string, substring: string): Query {
    //     return this._parseQuery.contains(key, substring);
    // }
    //
    // containsAll(key: any, values: any[]): Query {
    //     return this._parseQuery.containsAll(key, values);
    // }
    //
    // containsAllStartingWith(key: any, values: any[]): Query {
    //     return this._parseQuery.containsAllStartingWith(key, values);
    // }
    //
    // count(options?: Query.CountOptions): Promise<number> {
    //     return this._parseQuery.count(options);
    // }
    //
    // descending(key: any[] | any): Query {
    //     return this._parseQuery.descending(key);
    // }
    //
    // distinct(key: any): Promise<any> {
    //     return this._parseQuery.distinct(key);
    // }
    //
    // doesNotExist(key: any): Query {
    //     return this._parseQuery.doesNotExist(key);
    // }
    //
    // // doesNotMatchKeyInQuery<U extends Object, K extends keyof Object["attributes"] | keyof BaseAttributes, X extends Extract<keyof U["attributes"], string>>(key: K, queryKey: X, query: Query<U>): this {
    // //     return undefined;
    // // }
    //
    // // doesNotMatchQuery<U extends Object, K extends keyof Object["attributes"]>(key: K, query: Query<U>): this {
    // //     return undefined;
    // // }
    //
    // each(callback: (obj: Object) => (PromiseLike<void> | void), options?: Query.EachOptions): Promise<void> {
    //     return undefined;
    // }
    //
    // endsWith(key: any, suffix: string): Query {
    //     return this._parseQuery.endsWith(key, suffix);
    // }
    //
    // equalTo(key: any, value: any): Query {
    //     return this._parseQuery.equalTo(key, value);
    // }
    //
    // exists(key: any): Query {
    //     return this._parseQuery.exists(key);
    // }

    // first(options?: Query.FirstOptions): Promise<Object | undefined> {
    //     return undefined;
    // }
    //
    // fromJSON(className: string, json: any): Query {
    //     return Query.fromJSON(className, json);
    // }
    //
    // fromLocalDatastore(): void {
    // }
    //
    // fromPin(): void {
    // }
    //
    // fromPinWithName(name: string): void {
    // }
    //
    // fullText(key: K, value: string, options?: Query.FullTextOptions): this {
    //     return undefined;
    // }
    //
    // get(objectId: string, options?: Query.GetOptions): Promise<Object> {
    //     return undefined;
    // }
    //
    // greaterThan(key: K, value: Object["attributes"][K]): this {
    //     return undefined;
    // }
    //
    // greaterThanOrEqualTo(key: K, value: Object["attributes"][K]): this {
    //     return undefined;
    // }
    //
    // include(key: K[] | K): this {
    //     return undefined;
    // }
    //
    // includeAll(): Query<Object> {
    //     return undefined;
    // }
    //
    // lessThan(key: K, value: Object["attributes"][K]): this {
    //     return undefined;
    // }
    //
    // lessThanOrEqualTo(key: K, value: Object["attributes"][K]): this {
    //     return undefined;
    // }
    //
    // limit(n: number): Query<Object> {
    //     return undefined;
    // }
    //
    // matches(key: K, regex: RegExp, modifiers?: string): this {
    //     return undefined;
    // }
    //
    // matchesKeyInQuery<U extends Object, K extends keyof Object["attributes"], X extends Extract<keyof U["attributes"], string>>(key: K, queryKey: X, query: Query<U>): this {
    //     return undefined;
    // }
    //
    // matchesQuery<U extends Object, K extends keyof Object["attributes"]>(key: K, query: Query<U>): this {
    //     return undefined;
    // }
    //
    // near(key: K, point: GeoPoint): this {
    //     return undefined;
    // }
    //
    // nor(...args: Array<Query>): Query {
    //     return Query.nor(...args);
    // }
    //
    // notContainedIn(key: K, values: Array<Object["attributes"][K]>): this {
    //     return undefined;
    // }
    //
    // notEqualTo(key: K, value: Object["attributes"][K]): this {
    //     return undefined;
    // }
    //
    // or(...var_args: Array<Query>): Query {
    //     return Query.or(...var_args);
    // }
    //
    // polygonContains(key: K, point: GeoPoint): this {
    //     return undefined;
    // }
    //
    // select(...keys: K[]): this {
    //     return undefined;
    // }
    //
    // skip(n: number): Query<Object> {
    //     return undefined;
    // }
    //
    // sortByTextScore(): this {
    //     return undefined;
    // }
    //
    // startsWith(key: K, prefix: string): this {
    //     return undefined;
    // }
    //
    // subscribe(): Promise<LiveQuerySubscription> {
    //     return undefined;
    // }
    //
    // toJSON(): any {
    // }
    //
    // withJSON(json: any): this {
    //     return undefined;
    // }
    //
    // withinGeoBox(key: K, southwest: GeoPoint, northeast: GeoPoint): this {
    //     return undefined;
    // }
    //
    // withinKilometers(key: K, point: GeoPoint, maxDistance: number): this {
    //     return undefined;
    // }
    //
    // withinMiles(key: K, point: GeoPoint, maxDistance: number): this {
    //     return undefined;
    // }
    //
    // withinPolygon(key: K, points: number[][]): this {
    //     return undefined;
    // }
    //
    // withinRadians(key: K, point: GeoPoint, maxDistance: number): this {
    //     return undefined;
    // }


}
