import {CacheAdapter} from "../adapters/cache.adapter";
import {RequestOptions} from "../controllers/query.controller";
import {isBrowser, isElectron, isWebWorker} from "../utils/platform.util";
import {Dexie, Table} from "dexie";
import {sha1} from "crypto-hash";

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

    static async table(database: string, collection: string): Promise<Table | undefined> {
        if (isElectron || isBrowser || isWebWorker) {
            const db = new Dexie(await sha1(database));
            db.version(1).stores({
                [collection]: ""
            });
            return db.table(collection);
        }
        return undefined;
    }

    async keys(database: string, collection: string): Promise<string[]> {
        if (isElectron || isBrowser || isWebWorker) {
            const t = await DefaultCacheFactory.table(database, collection);
            const keys = await t?.toCollection().keys() as string[];
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
            const t = await DefaultCacheFactory.table(database, collection);
            await t?.clear();
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
            const t = await DefaultCacheFactory.table(database, collection);
            return t?.get(key);
        }
        return null;
    }

    async getBulk<T>(keys: string[], database: string, collection: string): Promise<T[]> {
        if (isElectron || isBrowser || isWebWorker) {
            const table = await DefaultCacheFactory.table(database, collection);
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
            const t = await DefaultCacheFactory.table(database, collection);
            await t?.put(data, key);
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
            const t = await DefaultCacheFactory.table(database, collection);
            await t?.bulkPut(data, keys, {allKeys: true});
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
            const t = await DefaultCacheFactory.table(database, collection);
            await t?.delete(key);
            return true;
        }
        return true;
    }

    cacheEnabled(appName: string, options?: RequestOptions): boolean {
        return true;
    }
}
