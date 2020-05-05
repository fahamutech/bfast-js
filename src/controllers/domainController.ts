import {DomainI, DomainModel} from "../core/DomainAdapter";
import {QueryController} from "./QueryController";
import {CacheAdapter, CacheOptions, FindOptionsWithCacheOptions} from "../core/CacheAdapter";
import {BFastConfig} from "../conf";

const axios = require('axios').default;

export class DomainController<T extends DomainModel> implements DomainI<T> {

    constructor(private readonly domainName: string,
                private readonly cacheAdapter: CacheAdapter,
                private readonly appName = BFastConfig.DEFAULT_APP) {
    }

    async save<T>(model: T, options?: CacheOptions): Promise<T> {
        if (model) {
            try {
                const response = await axios.post(
                    `${BFastConfig.getInstance().databaseURL(this.appName)}/classes/${this.domainName}`,
                    model, {
                        headers: BFastConfig.getInstance().getHeaders(this.appName)
                    });
                return response.data;
            } catch (e) {
                throw e;
            }
        } else {
            return Promise.reject({code: -1, message: 'please provide data to save'});
        }
    }

    async getAll<T>(pagination?: { size: number, skip: number }, options?: FindOptionsWithCacheOptions): Promise<T[]> {
        const number = pagination ? pagination.size : await this.query().count();
        const query = this.query();
        query.skip(pagination ? pagination.skip : 0);
        query.limit(number);
        return JSON.parse(JSON.stringify(await query.find(options)));
    }

    async get<T>(objectId: string, options?: CacheOptions): Promise<T> {
        return JSON.parse(JSON.stringify(await this.query<T>().get(objectId)));
    }

    async delete<T>(objectId: string, options?: CacheOptions): Promise<T> {
        const response = await axios.delete(
            `${BFastConfig.getInstance().databaseURL(this.appName)}/classes/${this.domainName}/${objectId}`,
            {
                headers: BFastConfig.getInstance().getHeaders(this.appName)
            }
        );
        return response.data;
    }

    query<T>(options?: CacheOptions): QueryController<T> {
        try {
            return new QueryController<T>(this.domainName, this.cacheAdapter, this.appName);
        } catch (e) {
            throw e;
        }
    }

    async update<T>(objectId: string, model: T, options?: CacheOptions): Promise<T> {
        try {
            const response = await axios.put(
                `${BFastConfig.getInstance().databaseURL(this.appName)}/classes/${this.domainName}/${objectId}`,
                model,
                {
                    headers: BFastConfig.getInstance().getHeaders(this.appName)
                }
                new Parse()
            );
            return response.data;
        } catch (e) {
            throw e;
        }
    }

}

