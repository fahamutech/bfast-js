import {CacheAdapter} from "../adapters/cache.adapter";
import {RequestOptions} from "../controllers/query.controller";
import {isNode} from "../utils/platform.util";

// @ts-ignore
import localForage from "localforage";

export class DefaultCacheFactory implements CacheAdapter {

    constructor() {
    }

    async getAll(database: string, collection: string): Promise<any[]> {
        if (isNode) {
            return [];
        }
        const all: any[] = [];
        await DefaultCacheFactory._getCacheDatabase(database, collection)?.iterate((value: any, _: string) => {
            all.push(value);
        });
        return all;
    }

    private static _getCacheDatabase(database: string, collection: string): any {
        if (isNode) {
            return undefined;
        }
        return localForage.createInstance({
            storeName: collection,
            name: database
        });
    }

    async keys(database: string, collection: string): Promise<string[] | undefined> {
        if (isNode) {
            return [];
        }
        return DefaultCacheFactory._getCacheDatabase(database, collection)?.keys();
    }

    async clearAll(database: string, collection: string): Promise<boolean> {
        if (isNode) {
            return true;
        }
        await DefaultCacheFactory._getCacheDatabase(database, collection)?.clear();
        return true;
    }

    async get<T extends any>(identifier: string, database: string, collection: string, options: { secure?: boolean } = {secure: false}): Promise<T> {
        if (isNode) {
            return null as any;
        }
        // if (options.secure === true) {
        //     return await this.securityController.decrypt(response) as any;
        // } else {
        return await DefaultCacheFactory._getCacheDatabase(database, collection)?.getItem(identifier);
        // }
    }

    async set<T>(identifier: string, data: T, database: string, collection: string, options: { dtl?: number, secure?: boolean } = {secure: false}): Promise<T> {
        if (isNode) {
            return null as any;
        }
        // if (options.secure === true) {
        //     data = await this.securityController.encrypt(data) as any;
        // }
        return DefaultCacheFactory._getCacheDatabase(database, collection).setItem(identifier, data);
    }

    async remove(identifier: string, database: string, collection: string, force = true): Promise<boolean> {
        if (isNode) {
            return true;
        }
        // const dayToLeave = await DefaultCacheFactory._getCacheDatabase(database, '_ttl').getItem(identifier as any);
        // if (force || (dayToLeave && dayToLeave < new Date().getTime())) {
        //     await DefaultCacheFactory._getCacheDatabase(database, '_ttl')?.removeItem(identifier);
        await DefaultCacheFactory._getCacheDatabase(database, collection)?.removeItem(identifier);
        return true;
    }

    cacheEnabled(appName: string, options?: RequestOptions): boolean {
        if (isNode) {
            return false;
        }
        // if (options && options.cacheEnable !== undefined && options.cacheEnable !== null) {
        //     return options.cacheEnable;
        // } else {
        //     return BFastConfig.getInstance().credential(appName).cache?.enable === true;
        // }
        return true;
    }
}
