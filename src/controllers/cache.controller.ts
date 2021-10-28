import {CacheAdapter} from "../adapters/cache.adapter";
import {BFastConfig} from "../conf";
import {addSyncs, removeOneSyncs, getAllSyncs, getOneSyncs, removeAllSyncs, getSyncsKeys} from '../utils/syncs.util'
import {SyncsModel} from "../models/syncs.model";

export class CacheController {

    constructor(private readonly appName: string,
                private readonly database: string,
                private readonly collection: string,
                private readonly cacheAdapter: CacheAdapter) {
        if (database && !database.startsWith('bfast/')) {
            this.database = BFastConfig.getInstance().cacheDatabaseName(database, appName);
        }
        this.collection = BFastConfig.getInstance().cacheCollectionName(collection, appName);
    }

    async keys(): Promise<string[]> {
        const keys = await this.cacheAdapter.keys(this.database, this.collection);
        return keys && Array.isArray(keys) ? keys : [];
    }

    async clearAll(): Promise<boolean> {
        return this.cacheAdapter.clearAll(this.database, this.collection);
    }

    async get<T>(key: string, options: { secure?: boolean } = {secure: false}): Promise<T | null> {
        // if (!key) {
        //     throw {message: 'key of the data to retrieve required'};
        // }
        return this.cacheAdapter.get<T>(
            key,
            this.database,
            this.collection
        );
    }

    async getBulk<T>(keys: string[], options: { secure?: boolean } = {secure: false}): Promise<T[] | null> {
        if (!Array.isArray(keys)) {
            throw {message: 'Array of keys required'};
        }
        return this.cacheAdapter.getBulk<T>(
            keys,
            this.database,
            this.collection
        );
    }

    async getAll(): Promise<Array<any>> {
        return this.cacheAdapter.getAll(this.database, this.collection);
    }

    async query(filter: (element: { [key: string]: any }[]) => any): Promise<any> {
        const all = await this.getAll();
        return filter(all);
    }

    async set<T>(key: string, data: T, options: { dtl?: number, secure?: boolean } = {secure: false}): Promise<T> {
        // if (!key) {
        //     throw {message: 'key for the data is required'};
        // }
        // if (!data) {
        //     throw {message: 'data to save to cache required'};
        // }
        return this.cacheAdapter.set(key, data, this.database, this.collection);
    }

    async setBulk<T>(keys: string[], data: T[], options: { dtl?: number, secure?: boolean } = {secure: false}): Promise<T[]> {
        if (!Array.isArray(keys)) {
            throw {message: 'Array of keys required'};
        }
        if (!Array.isArray(data)) {
            throw {message: 'Array of data required'};
        }
        return this.cacheAdapter.setBulk(keys, data, this.database, this.collection);
    }

    async remove(key: string, force = true): Promise<boolean> {
        // if (!key) {
        //     throw {message: 'key for data to remove required'};
        // }
        return this.cacheAdapter.remove(key, this.database, this.collection, true);
    }

    async addSyncs(data: SyncsModel) {
        return addSyncs(data, this.database, this.cacheAdapter);
    }

    async removeOneSyncs(key: string) {
        return removeOneSyncs(key, this.database, this.cacheAdapter);
    }

    async removeAllSyncs() {
        return removeAllSyncs(this.database, this.cacheAdapter);
    }

    async getAllSyncs(): Promise<SyncsModel[]> {
        return getAllSyncs(this.database, this.cacheAdapter);
    }

    async getOneSyncs(key: string): Promise<SyncsModel> {
        return getOneSyncs(this.database, key, this.cacheAdapter);
    }

    async getSyncsKeys(): Promise<string[]> {
        return getSyncsKeys(this.database, this.cacheAdapter);
    }
}
