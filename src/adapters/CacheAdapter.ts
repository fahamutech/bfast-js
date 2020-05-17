import {RequestOptions} from "./QueryAdapter";

export interface CacheAdapter {
    cacheDatabaseName: string;

    set<T>(identifier: string, data: T, options?: { dtl: number }): Promise<T>;

    get<T>(identifier: string): Promise<T>;

    clearAll(): Promise<boolean>;

    remove(identifier: string, force?: boolean): Promise<boolean>;

    cacheEnabled(options?: RequestOptions): boolean;
}
