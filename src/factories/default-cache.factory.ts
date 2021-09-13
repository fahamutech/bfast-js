import {CacheAdapter} from "../adapters/cache.adapter";
import {RequestOptions} from "../controllers/query.controller";
import {isBrowser, isElectron} from "../utils/platform.util";

// @ts-ignore
import localForage from "localforage";

export class DefaultCacheFactory implements CacheAdapter {

    constructor() {
    }

    async getAll(database: string, collection: string): Promise<any[]> {
        if (isElectron || isBrowser) {
            const all: any[] = [];
            await DefaultCacheFactory._getCacheDatabase(database, collection)?.iterate((value: any, _: string) => {
                all.push(value);
            });
            return all;
        }
        return [];
    }

    private static _getCacheDatabase(database: string, collection: string): any {
        if (isElectron || isBrowser) {
            return localForage.createInstance({
                storeName: collection,
                name: database
            });
        }
        return undefined;
    }

    async keys(database: string, collection: string): Promise<string[] | undefined> {
        if (isElectron || isBrowser) {
            return DefaultCacheFactory._getCacheDatabase(database, collection)?.keys();
        }
        return []
    }

    async clearAll(database: string, collection: string): Promise<boolean> {
        if (isElectron || isBrowser) {
            await DefaultCacheFactory._getCacheDatabase(database, collection)?.clear();
            return true;
        }
        return true;
    }

    async get<T extends any>(identifier: string, database: string, collection: string, options: { secure?: boolean } = {secure: false}): Promise<T> {
        if (isElectron || isBrowser) {
            return await DefaultCacheFactory._getCacheDatabase(database, collection)?.getItem(identifier);
        }
        return null as any;
    }

    async set<T>(identifier: string, data: T, database: string, collection: string, options: { dtl?: number, secure?: boolean } = {secure: false}): Promise<T> {
        if (isElectron || isBrowser) {
            return DefaultCacheFactory._getCacheDatabase(database, collection).setItem(identifier, data);
        }
        return null as any;
    }

    async remove(identifier: string, database: string, collection: string, force = true): Promise<boolean> {
        if (isElectron || isBrowser) {
            await DefaultCacheFactory._getCacheDatabase(database, collection)?.removeItem(identifier);
            return true;
        }
        return true;
    }

    cacheEnabled(appName: string, options?: RequestOptions): boolean {
        return !!(isElectron || isBrowser);
    }
}
