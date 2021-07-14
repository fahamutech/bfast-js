import {CacheAdapter} from "../adapters/cache.adapter";
import {BFastConfig} from "../conf";

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
        return keys && Array.isArray(keys)?keys: [];
    }

    async clearAll(): Promise<boolean> {
        return this.cacheAdapter.clearAll(this.database, this.collection);
    }

    async get<T>(identifier: string, options: { secure?: boolean } = {secure: false}): Promise<T> {
        return this.cacheAdapter.get<T>(identifier, this.database, this.collection, {secure: options.secure});
    }

    async getAll(): Promise<Array<any>> {
        const keys = await this.keys();
        return Promise.all(keys.map(k=>this.get(k)));
    }

    async query(filter: (element: {[key:string]: any}[])=>any): Promise<any>{
        const all = await this.getAll();
        return filter(all);
    }

    async set<T>(identifier: string, data: T, options: { dtl?: number, secure?: boolean } = {secure: false}): Promise<T> {
        return this.cacheAdapter.set(identifier, data, this.database, this.collection, options);
    }

    async remove(identifier: string, force = true): Promise<boolean> {
        return this.cacheAdapter.remove(identifier, this.database, this.collection, true);
    }

    // async getDatabases(){
    //     const databases = await this.cacheAdapter.databases();
    // }

    // async getCollections(database: string){
    //     return this.cacheAdapter.collections(database);
    // }

}
