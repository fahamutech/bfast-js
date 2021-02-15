import {CacheAdapter} from "../adapters/CacheAdapter";
import {BFastConfig} from "../conf";
import {RequestOptions} from "../controllers/QueryController";
import {SecurityController} from "../controllers/SecurityController";
import {isNode} from "../utils/bfast.util";

const localForage = require('localforage');

export class DefaultCacheFactory implements CacheAdapter {

    constructor(private readonly securityController: SecurityController) {
    }

    private static _getCacheDatabase(database: string, collection: string): any {
        if (isNode()) {
            return undefined;
        }
        return localForage.createInstance({
            storeName: collection,
            name: database
        });
    }

    async keys(database: string, collection: string): Promise<string[] | undefined> {
        if (isNode()) {
            return [];
        }
        return DefaultCacheFactory._getCacheDatabase(database, collection)?.keys();
    }

    async clearAll(database: string, collection: string): Promise<boolean> {
        if (isNode()) {
            return true;
        }
        await DefaultCacheFactory._getCacheDatabase(database, collection)?.clear();
        await DefaultCacheFactory._getCacheDatabase(database, '_ttl')?.clear();
        return true;
    }

    async get<T extends any>(identifier: string, database: string, collection: string, options: { secure?: boolean } = {secure: false}): Promise<T> {
        //  try {
        if (isNode()) {
            return null as any;
        }
        await this.remove(identifier, database, collection);
        const response = await DefaultCacheFactory._getCacheDatabase(database, collection)?.getItem(identifier);
        if (options.secure === true) {
            return await this.securityController.decrypt(response) as any;
        } else {
            return response;
        }
        // } catch (e) {
        //     return this.set<any>(identifier, null, database, collection, options)
        // }
    }

    async set<T>(identifier: string, data: T, database: string, collection: string, options: { dtl?: number, secure?: boolean } = {secure: false}): Promise<T> {
        if (isNode()) {
            return null as any;
        }
        if (options.secure === true) {
            data = await this.securityController.encrypt(data) as any;
        }
        const response = await DefaultCacheFactory._getCacheDatabase(database, collection).setItem(identifier, data);
        await DefaultCacheFactory._getCacheDatabase(database, '_ttl')?.setItem(identifier,
            String(DefaultCacheFactory._getDayToLeave(options && options.dtl ? options.dtl : 7)));
        return response as any;
    }

    private static _getDayToLeave(days: number) {
        const date = new Date();
        return date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    }

    async remove(identifier: string, database: string, collection: string, force = true): Promise<boolean> {
        if (isNode()) {
            return true;
        }
        // const dayToLeave = await DefaultCacheFactory._getCacheDatabase(database, '_ttl').getItem(identifier as any);
        // if (force || (dayToLeave && dayToLeave < new Date().getTime())) {
        //     await DefaultCacheFactory._getCacheDatabase(database, '_ttl')?.removeItem(identifier);
        await DefaultCacheFactory._getCacheDatabase(database, collection)?.removeItem(identifier);
        return true;
        // } else {
        //     return false;
        // }
    }

    cacheEnabled(appName: string, options?: RequestOptions): boolean {
        if (isNode()) {
            return false;
        }
        if (options && options.cacheEnable !== undefined && options.cacheEnable !== null) {
            return options.cacheEnable;
        } else {
            return BFastConfig.getInstance().credential(appName).cache?.enable === true;
        }
    }
}
