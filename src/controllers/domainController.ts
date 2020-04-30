import {DomainI, DomainModel} from "../core/DomainAdapter";
import {BFastConfig} from "../conf";
import {QueryController} from "./QueryController";
import {CacheAdapter, CacheOptions, FindOptionsWithCacheOptions} from "../core/CacheAdapter";

const axios = require('axios');

export class DomainController<T extends DomainModel> implements DomainI<T> {

    domainName: string;
    private readonly cloudObj: Parse.Object;

    constructor(private name: string,
                private _parse: any,
                private readonly cacheAdapter: CacheAdapter) {
        this.domainName = name;
        const CloudObj = _parse.Object.extend(this.domainName);
        this.cloudObj = new CloudObj;
    }

    async save<T>(model: T, options?: CacheOptions): Promise<T> {
        if (model) {
            try {
                const response = await this.cloudObj.save(model);
                return JSON.parse(JSON.stringify(response));
            } catch (e) {
                throw e;
            }
        } else {
            return Promise.reject({code: -1, message: 'please provide data to save'});
        }
    }

    async getAll<T>(pagination?: { size: number, skip: number }, options?: FindOptionsWithCacheOptions): Promise<T[]> {
        try {
            const number = pagination ? pagination.size : await this.query().count();
            const query = this.query();
            query.skip(pagination ? pagination.skip : 0);
            query.limit(number);
            return JSON.parse(JSON.stringify(await query.find(options)));
        } catch (e) {
            throw e;
        }
    }

    async get<T>(objectId: string, options?: CacheOptions): Promise<T> {
        try {
            return JSON.parse(JSON.stringify(await this.query<T>().get(objectId)));
        } catch (e) {
            throw e;
        }
    }

    async delete<T>(objectId: string, options?: CacheOptions): Promise<T> {
        try {
            const response = await axios.delete(
                `${BFastConfig.getInstance().getCloudDatabaseUrl()}/classes/${this.domainName}/${objectId}`,
                {
                    headers: BFastConfig.getInstance().getHeaders()
                }
            );
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    query<T>(options?: CacheOptions): QueryController<T> {
        try {
            return new QueryController<T>(this.domainName, this.cacheAdapter);
        } catch (e) {
            throw e;
        }
    }

    async update<T>(objectId: string, model: T, options?: CacheOptions): Promise<T> {
        try {
            const response = await axios.put(
                `${BFastConfig.getInstance().getCloudDatabaseUrl()}/classes/${this.domainName}/${objectId}`,
                model,
                {
                    headers: BFastConfig.getInstance().getHeaders()
                }
            );
            return response.data;
        } catch (e) {
            throw e;
        }
    }

}

