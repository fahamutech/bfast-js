import {CacheAdapter} from "../adapters/cache.adapter";
import {RequestOptions} from "../controllers/query.controller";
import {isBrowser, isElectron, isWebWorker} from "../utils/platform.util";
import {Dexie, Table} from "dexie";
// @ts-ignore
import {SHA1} from "crypto-es/lib/sha1";

export class DefaultCacheFactory implements CacheAdapter {

    constructor() {
    }

    async getAll(database: string, collection: string): Promise<any[]> {
        if (isElectron || isBrowser || isWebWorker) {
            const table = await DefaultCacheFactory.table(database, collection);
            const keys = await this.keys(database, collection);
            if (Array.isArray(keys)) {
                return await table?.bulkGet(keys) as any[];
            }
            return [];
        }
        return [];
    }

    static table(database: string, collection: string): Table | undefined {
        if (isElectron || isBrowser || isWebWorker) {
            const db = new Dexie(SHA1(database).toString());
            db.version(1).stores({
                [collection]: ""
            });
            return db.table(collection);
        }
        return undefined;
    }

    async keys(database: string, collection: string): Promise<string[]> {
        if (isElectron || isBrowser || isWebWorker) {
            const keys = await DefaultCacheFactory.table(database, collection)?.toCollection().keys() as string[];
            if (Array.isArray(keys)) {
                return keys;
            } else {
                return [];
            }
        }
        return [];
    }

    async clearAll(database: string, collection: string): Promise<boolean> {
        if (isElectron || isBrowser || isWebWorker) {
            await DefaultCacheFactory.table(database, collection)?.clear();
            return true;
        }
        return true;
    }

    async get<T>(
        key: string,
        database: string,
        collection: string
    ): Promise<T | null> {
        if (isElectron || isBrowser || isWebWorker) {
            return DefaultCacheFactory.table(database, collection)?.get(key);
        }
        return null;
    }

    async getBulk<T>(keys: string[], database: string, collection: string): Promise<T[]> {
        if (isElectron || isBrowser || isWebWorker) {
            const table = DefaultCacheFactory.table(database, collection);
            if (Array.isArray(keys)) {
                return await table?.bulkGet(keys) as any[];
            }
            return [];
        }
        return [];
    }

    async set(
        key: string,
        data: any,
        database: string,
        collection: string,
        options: { dtl?: number, secure?: boolean } = {secure: false}
    ): Promise<any> {
        if (isElectron || isBrowser || isWebWorker) {
            await DefaultCacheFactory.table(database, collection)?.put(data, key);
            return data;
        }
        return null as any;
    }

    async setBulk(
        keys: string[],
        data: any[],
        database: string,
        collection: string
    ): Promise<any> {
        if (isElectron || isBrowser || isWebWorker) {
            await DefaultCacheFactory.table(database, collection)?.bulkPut(data, keys, {allKeys: true});
            return keys;
        }
        return null as any;
    }

    async remove(
        key: string,
        database: string,
        collection: string,
        force = true
    ): Promise<boolean> {
        if (isElectron || isBrowser || isWebWorker) {
            await DefaultCacheFactory.table(database, collection)?.delete(key);
            return true;
        }
        return true;
    }

    cacheEnabled(appName: string, options?: RequestOptions): boolean {
        return true;
    }
}
