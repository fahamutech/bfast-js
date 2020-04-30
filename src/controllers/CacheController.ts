import {CacheAdapter, CacheOptions} from "../core/CacheAdapter";
import * as localForage from 'localforage'
import {BFastConfig} from "../conf";

export class CacheController implements CacheAdapter {
    cacheName: string;

    constructor(cacheName: string,
                private readonly  storeName?: string) {
        this.cacheName = cacheName;
    }

    private _getStore(): LocalForage {
        return localForage.createInstance({
            storeName: this.storeName ? this.storeName : BFastConfig.getInstance().cache?.cacheStoreName,
            name: this.cacheName
        });
    }

    private _getTTLStore(): LocalForage {
        return localForage.createInstance({
            storeName: BFastConfig.getInstance().cache?.cacheStoreTTLName,
            name: this.cacheName
        });
    }

    async clearAll(): Promise<boolean> {
        try {
            await this._getStore().clear();
            await this._getTTLStore().clear();
            return true;
        } catch (e) {
            throw e;
        }
    }

    async get<T>(identifier: string): Promise<T> {
        try {
            await this.remove(identifier);
            return await this._getStore().getItem<T>(identifier);
        } catch (e) {
            throw e;
        }
    }

    async set<T>(identifier: string, data: T, options?: { dtl: number }): Promise<T> {
        try {
            const response = await this._getStore().setItem<T>(identifier, data);
            await this._getTTLStore().setItem(identifier, CacheController._getDayToLeave(options ? options.dtl : 7));
            return response;
        } catch (e) {
            throw e;
        }
    }

    private static _getDayToLeave(days: number) {
        const date = new Date();
        return date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    }

    async remove(identifier: string): Promise<boolean> {
        try {
            const dayToLeave = await this._getTTLStore().getItem<number>(identifier);
            if (dayToLeave && dayToLeave < new Date().getTime()) {
                await this._getTTLStore().removeItem(identifier);
                await this._getStore().removeItem(identifier);
                return true;
            } else {
                return false;
            }
        } catch (e) {
            throw e;
        }
    }

    cacheEnabled(options?: CacheOptions): boolean {
        if (options) {
            return options.cacheEnable;
        } else {
            return BFastConfig.getInstance().cache?.enable === true;
        }
    }

}