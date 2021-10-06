import {RequestOptions} from "../controllers/query.controller";

export abstract class CacheAdapter {
    abstract set<T>(
        key: string,
        data: T,
        database: string,
        collection: string
    ): Promise<T>;
    abstract setBulk<T>(
        keys: string[],
        data: T[],
        database: string,
        collection: string
    ): Promise<T[]>;
    abstract get<T>(
        key: string,
        database: string,
        collection: string,
    ): Promise<T | null>;
    abstract getBulk<T>(
        keys: string[],
        database: string,
        collection: string,
    ): Promise<T[]>;

    abstract keys(database: string, collection: string): Promise<string[] | undefined>;

    abstract clearAll(database: string, collection: string): Promise<boolean>;

    abstract getAll(database: string, collection: string): Promise<any[]>;

    abstract remove(key: string, database: string, collection: string, force?: boolean): Promise<boolean>;

    abstract cacheEnabled(appName: string, options?: RequestOptions): boolean;
}
