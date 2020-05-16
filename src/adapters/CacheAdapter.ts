import {CacheOptions} from "./QueryAdapter";

export interface CacheAdapter {
    cacheDatabaseName: string;

    set<T>(identifier: string, data: T, options?: { dtl: number }): Promise<T>;

    get<T>(identifier: string): Promise<T>;

    clearAll(): Promise<boolean>;

    remove(identifier: string): Promise<boolean>;

    cacheEnabled(options?: CacheOptions): boolean;
}
