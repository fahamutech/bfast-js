import {Query} from 'parse'
import {DomainModel} from "../core/domainInterface";

export class QueryController<T extends DomainModel> extends Query {

    constructor(collectionName: string) {
        super(collectionName);
    }

    addAscending<K extends any>(key: K[] | K): this {
        return super.addAscending(key);
    }

    addDescending<K extends any>(key: K[] | K): this {
        return super.addDescending(key);
    }

    ascending<K extends any>(key: K[] | K): this {
        return super.ascending(key);
    }

    aggregate<V = any>(pipeline: AggregationOptions | AggregationOptions[]): Promise<V> {
        return super.aggregate(pipeline);
    }

    containedBy<K extends any>(key: K, values: Array<T[K]>): this {
        return super.containedBy(key, values);
    }

    containedIn<K extends any>(key: K, values: Array<T[K]>): this {
        return super.containedIn(key, values);
    }

    contains<K extends any>(key: K, substring: string): this {
        return super.contains(key, substring);
    }

    containsAll<K extends any>(key: K, values: any[]): this {
        return super.containsAll(key, values);
    }

    containsAllStartingWith<K extends any>(key: K, values: any[]): this {
        return super.containsAllStartingWith(key, values);
    }

    count(options?: Parse.Query.CountOptions): Promise<number> {
        return super.count(options);
    }

    descending<K extends any>(key: K[] | K): this {
        return super.descending(key);
    }

    doesNotExist<K extends any>(key: K): this {
        return super.doesNotExist(key);
    }

    hint(value: string | object): this {
        return super.hint(value);
    }

    explain(explain: boolean): this {
        return super.explain(explain);
    }

    endsWith<K extends any>(key: K, suffix: string): this {
        return super.endsWith(key, suffix);
    }

    exists<K extends any>(key: K): this {
        return super.exists(key);
    }

    cancel(): this {
        return super.cancel();
    }

    fullText<K extends any>(key: K, value: string, options?: Parse.Query.FullTextOptions): this {
        return super.fullText(key, value, options);
    }

    get(objectId: string, options?: Parse.Query.GetOptions): Promise<any> {
        return super.get(objectId, options);
    }

    greaterThan<K extends any>(key: K, value: T[K]): this {
        return super.greaterThan(key, value);
    }

    include<K extends any>(key: K[] | K): this {
        return super.include(key);
    }

    lessThan<K extends any>(key: K, value: T[K]): this {
        return super.lessThan(key, value);
    }

    lessThanOrEqualTo<K extends any>(key: K, value: T[K]): this {
        return super.lessThanOrEqualTo(key, value);
    }

    limit(n: number): QueryController<T> {
        // @ts-ignore
        return super.limit(n);
    }

    matches<K extends any>(key: K, regex: RegExp, modifiers?: string): this {
        return super.matches(key, regex, modifiers);
    }

    notContainedIn<K extends any>(key: K, values: Array<T[K]>): this {
        return super.notContainedIn(key, values);
    }

    notEqualTo<K extends any>(key: K, value: T[K]): this {
        return super.notEqualTo(key, value);
    }

    polygonContains<K extends any>(key: K, point: Parse.GeoPoint): this {
        return super.polygonContains(key, point);
    }

    select<K extends any>(...keys: any[]): this {
        return super.select(...keys);
    }

    skip(n: number): QueryController<T> {
        // @ts-ignore
        return super.skip(n);
    }

    sortByTextScore(): this {
        return super.sortByTextScore();
    }

    startsWith<K extends any>(key: K, prefix: string): this {
        return super.startsWith(key, prefix);
    }

    subscribe(): Promise<Parse.LiveQuerySubscription> {
        return super.subscribe();
    }

    toJSON(): any {
        return super.toJSON();
    }

    withJSON(json: any): this {
        return super.withJSON(json);
    }

    withinGeoBox<K extends any>(key: K, southwest: Parse.GeoPoint, northeast: Parse.GeoPoint): this {
        return super.withinGeoBox(key, southwest, northeast);
    }

    withinKilometers<K extends any>(key: K, point: Parse.GeoPoint, maxDistance: number): this {
        return super.withinKilometers(key, point, maxDistance);
    }

    withinMiles<K extends any>(key: K, point: Parse.GeoPoint, maxDistance: number): this {
        return super.withinMiles(key, point, maxDistance);
    }

    withinPolygon<K extends any>(key: K, points: number[][]): this {
        return super.withinPolygon(key, points);
    }

    withinRadians<K extends any>(key: K, point: Parse.GeoPoint, maxDistance: number): this {
        return super.withinRadians(key, point, maxDistance);
    }

    equalTo<K extends any>(key: K, value: any): this {
        return super.equalTo(key, value);
    }

    near<K extends any>(key: K, point: Parse.GeoPoint): this {
        return super.near(key, point);
    }

    greaterThanOrEqualTo<K extends any>(key: K, value: T[K]): this {
        return super.greaterThanOrEqualTo(key, value);
    }

    async distinct<T>(key: any): Promise<T> {
        try {
            const response = super.distinct(key);
            return JSON.parse(JSON.stringify(response));
        } catch (e) {
            throw e;
        }
    }

    async find<T>(options?: Query.FindOptions): Promise<T[]> {
        try {
            const response = await super.find(options);
            return JSON.parse(JSON.stringify(response));
        } catch (e) {
            throw e;
        }
    }

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