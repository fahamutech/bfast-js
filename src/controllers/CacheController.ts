import {CacheAdapter, CacheOptions} from "../core/CacheAdapter";
import * as localForage from 'localforage'
import {BFastConfig} from "../conf";

export class CacheController implements CacheAdapter {
    cacheStoreName: string;
    private readonly _storage: LocalForage;
    private readonly _ttlStorage: LocalForage;

    constructor(cacheName: string) {
        this.cacheStoreName = cacheName;
        this._storage = localForage.createInstance({
            storeName: BFastConfig.getInstance().cache?.cacheName,
            name: this.cacheStoreName
        });
        this._ttlStorage = localForage.createInstance({
            storeName: BFastConfig.getInstance().cache?.cacheDtlName,
            name: this.cacheStoreName
        });
    }

    async clearAll(): Promise<boolean> {
        try {
            await this._storage.clear();
            await this._ttlStorage.clear();
            return true;
        } catch (e) {
            throw e;
        }
    }

    async get<T>(identifier: string): Promise<T> {
        try {
            await this.remove(identifier);
            return await this._storage.getItem<T>(identifier);
        } catch (e) {
            throw e;
        }
    }

    async set<T>(identifier: string, data: T, options?: { dtl: number }): Promise<T> {
        try {
            const response = await this._storage.setItem<T>(identifier, data);
            await this._ttlStorage.setItem(identifier, CacheController._getDayToLeave(options ? options.dtl : 7));
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
            const dayToLeave = await this._ttlStorage.getItem<number>(identifier);
            if (dayToLeave && dayToLeave < new Date().getTime()) {
                await this._ttlStorage.removeItem(identifier);
                await this._storage.removeItem(identifier);
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