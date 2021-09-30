import {CacheAdapter} from "../adapters/cache.adapter";
import {RequestOptions} from "../controllers/query.controller";
import {isBrowser, isElectron, isWebWorker} from "../utils/platform.util";

// @ts-ignore
import * as localForage from "localforage";

export class DefaultCacheFactory implements CacheAdapter {

    constructor() {
    }

    async getAll(database: string, collection: string): Promise<any[]> {
        if (isElectron || isBrowser || isWebWorker) {
            const all: any[] = [];
            await DefaultCacheFactory._getCacheDatabase(database, collection)?.iterate((value: any, _: string) => {
                all.push(value);
            });
            return all;
        }
        // console.log('not in web or electron or worker', '---->getAll')
        return [];
    }

    private static _getCacheDatabase(database: string, collection: string): any {
        if (isElectron || isBrowser || isWebWorker) {
            return localForage.createInstance({
                storeName: collection,
                name: database
            });
        }
        // console.log('not in web or electron or worker', '---->instance')
        return undefined;
    }

    async keys(database: string, collection: string): Promise<string[] | undefined> {
        if (isElectron || isBrowser || isWebWorker) {
            return DefaultCacheFactory._getCacheDatabase(database, collection)?.keys();
        }
        // console.log('not in web or electron or worker', '---->keys');
        return []
    }

    async clearAll(database: string, collection: string): Promise<boolean> {
        if (isElectron || isBrowser || isWebWorker) {
            await DefaultCacheFactory._getCacheDatabase(database, collection)?.clear();
            return true;
        }
        // console.log('not in web or electron or worker', '---->clearAll')
        return true;
    }

    async get<T extends any>(identifier: string, database: string, collection: string, options: { secure?: boolean } = {secure: false}): Promise<T> {
        if (isElectron || isBrowser || isWebWorker) {
            return await DefaultCacheFactory._getCacheDatabase(database, collection)?.getItem(identifier);
        }
        // console.log('not in web or electron or worker', '---->get')
        return null as any;
    }

    async set<T>(identifier: string, data: T, database: string, collection: string, options: { dtl?: number, secure?: boolean } = {secure: false}): Promise<T> {
        if (isElectron || isBrowser || isWebWorker) {
            return DefaultCacheFactory._getCacheDatabase(database, collection).setItem(identifier, data);
        }
        // console.log('not in web or electron or worker', '---->set')
        return null as any;
    }

    async remove(identifier: string, database: string, collection: string, force = true): Promise<boolean> {
        if (isElectron || isBrowser || isWebWorker) {
            await DefaultCacheFactory._getCacheDatabase(database, collection)?.removeItem(identifier);
            return true;
        }
        // console.log('not in web or electron or worker', '---->remove')
        return true;
    }

    cacheEnabled(appName: string, options?: RequestOptions): boolean {
        return true;
    }
}
