import {CacheAdapter} from "../adapters/CacheAdapter";
import * as localForage from 'localforage';
import {BFastConfig} from "../conf";
import {RequestOptions} from "../adapters/QueryAdapter";
// @ts-ignore
import * as device from "browser-or-node";

export class CacheController implements CacheAdapter {
    cacheDatabaseName: string;

    constructor(private readonly appName: string,
                cacheDatabaseName: string,
                private readonly  cacheCollectionName: string) {
        this.cacheDatabaseName = cacheDatabaseName;
    }

    private _getCacheDatabase(): LocalForage | undefined {
        if (device.isNode) {
            return undefined;
        }
        let collectionNameFromCredential = BFastConfig.getInstance().getAppCredential(this.appName).cache?.cacheCollectionName;
        if (collectionNameFromCredential) {
            collectionNameFromCredential = BFastConfig.getInstance().getCacheCollectionName(collectionNameFromCredential, this.appName);
        }
        return localForage.createInstance({
            storeName: collectionNameFromCredential ? collectionNameFromCredential : this.cacheCollectionName,
            name: this.cacheDatabaseName
        });
    }

    private _getTTLStore(): LocalForage | undefined {
        if (device.isNode) {
            return undefined;
        }
        let ttlStoreFromCredential = BFastConfig.getInstance().getAppCredential(this.appName).cache?.cacheCollectionTTLName;
        if (ttlStoreFromCredential) {
            BFastConfig.getInstance().getCacheCollectionName(ttlStoreFromCredential, this.appName);
        }
        return localForage.createInstance({
            storeName: ttlStoreFromCredential ? ttlStoreFromCredential : 'cache_ttl_' + this.appName,
            name: this.cacheDatabaseName
        });
    }

    async clearAll(): Promise<boolean> {
        if (device.isNode) {
            return true;
        }
        await this._getCacheDatabase()?.clear();
        await this._getTTLStore()?.clear();
        return true;
    }

    async get<T extends any>(identifier: string): Promise<T> {
        if (device.isNode) {
            // @ts-ignore
            return null;
        }
        await this.remove(identifier);
        return await this._getCacheDatabase()?.getItem<T>(identifier) as any;
    }

    async set<T>(identifier: string, data: T, options?: { dtl: number }): Promise<T> {
        if (device.isNode) {
            // @ts-ignore
            return null;
        }
        const response = await this._getCacheDatabase()?.setItem<T>(identifier, data);
        await this._getTTLStore()?.setItem(identifier, CacheController._getDayToLeave(options ? options.dtl : 7));
        return response as any;
    }

    private static _getDayToLeave(days: number) {
        const date = new Date();
        return date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    }

    async remove(identifier: string): Promise<boolean> {
        if (device.isNode) {
            return true;
        }
        const dayToLeave = await this._getTTLStore()?.getItem<number>(identifier);
        if (dayToLeave && dayToLeave < new Date().getTime()) {
            await this._getTTLStore()?.removeItem(identifier);
            await this._getCacheDatabase()?.removeItem(identifier);
            return true;
        } else {
            return false;
        }
    }

    cacheEnabled(options?: RequestOptions): boolean {
        if (device.isNode) {
            return false;
        }
        if (options && options.cacheEnable !== undefined && options.cacheEnable !== null) {
            return options.cacheEnable;
        } else {
            return BFastConfig.getInstance().getAppCredential(this.appName).cache?.enable === true;
        }
    }

}
