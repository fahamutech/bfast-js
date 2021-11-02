import {CacheAdapter} from "../adapters/cache.adapter";
import {RequestOptions} from "../controllers/query.controller";
import {isBrowser, isElectron, isWebWorker} from "../utils/platform.util";
import {Dexie, Table} from "dexie";
// @ts-ignore
import * as sha1 from "js-sha1";

export class DefaultCacheFactory implements CacheAdapter {

    constructor() {
    }

    async getAll(database: string, collection: string): Promise<any[]> {
        if (isElectron || isBrowser || isWebWorker) {
            return this.withDexie(database, collection, async table1 => {
                const keys = await this.keys(database, collection);
                if (Array.isArray(keys)) {
                    return await table1.bulkGet(keys) as any[];
                }
                return [];
            });
        }
        return [];
    }

    async withDexie(dbname: string, collection: string, fn: (table: Table) => Promise<any>): Promise<any> {
        if (isElectron || isBrowser || isWebWorker) {
            const database = dbname + collection;
            const db = new Dexie(await sha1(database.trim()));
            db.version(1).stores({
                [collection]: ""
            }).upgrade(_ => {
                console.log('index db upgraded');
            });
            try {
                db.open();
                return await fn(db.table(collection));
            } finally {
                db.close();
            }
        }
        return undefined;
    }

    async keys(database: string, collection: string): Promise<string[]> {
        if (isElectron || isBrowser || isWebWorker) {
            return this.withDexie(database, collection, async table1 => {
                const keys = await table1.toCollection().keys() as string[];
                if (Array.isArray(keys)) {
                    return keys;
                } else {
                    return [];
                }
            });
        }
        return [];
    }

    async clearAll(database: string, collection: string): Promise<boolean> {
        if (isElectron || isBrowser || isWebWorker) {
            return this.withDexie(database, collection, async table1 => {
                await table1.clear();
                return true;
            });
        }
        return true;
    }

    async get<T>(
        key: string, database: string, collection: string
    ): Promise<T | null> {
        if (isElectron || isBrowser || isWebWorker) {
            return this.withDexie(database, collection, table1 => {
                return table1.get(key);
            });
        }
        return null;
    }

    async getBulk<T>(keys: string[], database: string, collection: string): Promise<T[]> {
        if (isElectron || isBrowser || isWebWorker) {
            return this.withDexie(database, collection, async table1 => {
                if (Array.isArray(keys)) {
                    return await table1.bulkGet(keys) as any[];
                }
                return [];
            });
        }
        return [];
    }

    async set(
        key: string, data: any, database: string, collection: string,
        options: { dtl?: number, secure?: boolean } = {secure: false}
    ): Promise<any> {
        if (isElectron || isBrowser || isWebWorker) {
            return this.withDexie(database, collection, async table1 => {
                await table1?.put(data, key);
                return data;
            });
        }
        return null as any;
    }

    async setBulk(
        keys: string[], data: any[], database: string, collection: string
    ): Promise<any> {
        if (isElectron || isBrowser || isWebWorker) {
            return this.withDexie(database, collection, async table1 => {
                await table1?.bulkPut(data, keys, {allKeys: true});
                return keys;
            });
        }
        return null as any;
    }

    async remove(
        key: string, database: string, collection: string, force = true
    ): Promise<boolean> {
        if (isElectron || isBrowser || isWebWorker) {
            return this.withDexie(database, collection, async table1 => {
                await table1?.delete(key);
                return true;
            });
        }
        return true;
    }

    cacheEnabled(appName: string, options?: RequestOptions): boolean {
        return true;
    }
}
