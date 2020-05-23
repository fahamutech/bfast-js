import {DomainI, DomainModel} from "../adapters/DomainAdapter";
import {QueryController} from "./QueryController";
import {CacheAdapter} from "../adapters/CacheAdapter";
import {BFastConfig} from "../conf";
import {RestAdapter} from "../adapters/RestAdapter";
import {RequestOptions} from "../adapters/QueryAdapter";

export class DomainController<T extends DomainModel> implements DomainI<T> {

    constructor(private readonly domainName: string,
                private readonly cacheAdapter: CacheAdapter,
                private readonly restAdapter: RestAdapter,
                private readonly appName: string) {
    }

    async save<T>(model: T, options?: RequestOptions): Promise<T> {
        if (model) {
            try {
                const response = await this.restAdapter.post(
                    `${BFastConfig.getInstance().databaseURL(this.appName)}/classes/${this.domainName}`, model, {
                        headers: (options && options.useMasterKey === true)
                            ? BFastConfig.getInstance().getMasterHeaders(this.appName)
                            : BFastConfig.getInstance().getHeaders(this.appName)
                    });
                return response.data;
            } catch (e) {
                throw {message: DomainController._getErrorMessage(e)};
            }
        } else {
            throw {message: 'please provide data to save'};
        }
    }

    async getAll<T>(pagination?: { size: number, skip: number }, options?: RequestOptions): Promise<T[]> {
        try {
            const number = pagination ? pagination.size : await this.query().count();
            const query = this.query();
            return await query.find({
                skip: pagination ? pagination.skip : 0,
                size: number
            }, options);
        } catch (e) {
            throw {message: DomainController._getErrorMessage(e)};
        }
    }

    async get<T>(objectId: string, options?: RequestOptions): Promise<T> {
        try {
            return await this.query<T>().get(objectId);
        } catch (e) {
            throw {message: DomainController._getErrorMessage(e)};
        }
    }

    async delete<T>(objectId: string, options?: RequestOptions): Promise<T> {
        try {
            const response = await this.restAdapter.delete(
                `${BFastConfig.getInstance().databaseURL(this.appName)}/classes/${this.domainName}/${objectId}`,
                {
                    headers: (options && options.useMasterKey === true)
                        ? BFastConfig.getInstance().getMasterHeaders(this.appName)
                        : BFastConfig.getInstance().getHeaders(this.appName)
                }
            );
            return response.data;
        } catch (e) {
            throw {message: DomainController._getErrorMessage(e)};
        }
    }

    query<T>(options?: RequestOptions): QueryController<T> {
        return new QueryController<T>(this.domainName, this.cacheAdapter, this.restAdapter, this.appName);
    }

    async update<T>(objectId: string, model: T, options?: RequestOptions): Promise<T> {
        try {
            const response = await this.restAdapter.put(
                `${BFastConfig.getInstance().databaseURL(this.appName)}/classes/${this.domainName}/${objectId}`,
                model,
                {
                    headers: (options && options.useMasterKey === true)
                        ? BFastConfig.getInstance().getMasterHeaders(this.appName)
                        : BFastConfig.getInstance().getHeaders(this.appName)
                }
            );
            return response.data;
        } catch (e) {
            throw {message: DomainController._getErrorMessage(e)};
        }
    }

    private static _getErrorMessage(e: any) {
        return (e && e.response && e.response.data) ? e.response.data : e.toString();
    }
}

