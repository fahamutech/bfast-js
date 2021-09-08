import {RequestOptions} from "../controllers/query.controller";

export abstract class CacheAdapter {
    abstract set<T>(identifier: string, data: T, database: string, collection: string, options?: { dtl?: number, secure?: boolean }): Promise<T>;

    abstract get<T>(identifier: string, database: string, collection: string, options?: { secure?: boolean }): Promise<T>;

    abstract keys(database: string, collection: string): Promise<string[] | undefined>;

    abstract clearAll(database: string, collection: string): Promise<boolean>;

    abstract getAll(database: string, collection: string): Promise<any[]>;

    abstract remove(identifier: string, database: string, collection: string, force?: boolean): Promise<boolean>;

    abstract cacheEnabled(appName: string, options?: RequestOptions): boolean;
}
