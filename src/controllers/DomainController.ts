import {DomainI, DomainModel} from "../adapters/DomainAdapter";
import {QueryController} from "./QueryController";
import {CacheAdapter} from "../adapters/CacheAdapter";
import {BFastConfig} from "../conf";
import {RestAdapter} from "../adapters/RestAdapter";
import {RequestOptions} from "../adapters/QueryAdapter";
import {RulesModel} from "../model/RulesModel";
import {AuthAdapter} from "../adapters/AuthAdapter";
import {UpdateBuilderController} from "./UpdateBuilderController";

export class DomainController<T extends DomainModel> implements DomainI<T> {

    constructor(private readonly domainName: string,
                private readonly cacheAdapter: CacheAdapter,
                private readonly restAdapter: RestAdapter,
                private readonly authAdapter: AuthAdapter,
                private readonly appName: string) {
    }

    async save<T extends { return: string[] }>(model: T | T[], options?: RequestOptions): Promise<T> {
        const createRule = {};
        if (options?.useMasterKey === true) {
            Object.assign(createRule, {
                masterKey: BFastConfig.getInstance().getAppCredential(this.appName).appPassword
            });
        }
        Object.assign(createRule, {
            applicationId: BFastConfig.getInstance().getAppCredential(this.appName).applicationId
        });
        if (model) {
            if (Array.isArray(model)) {
                model.map(x => {
                    x.return = options?.returnFields ? options.returnFields : [];
                    return x;
                });
            } else {
                model.return = options?.returnFields ? options.returnFields : [];
            }
            Object.assign(createRule, {
                [`create${this.domainName}`]: model
            });
            try {
                const response = await this.restAdapter.post(
                    `${BFastConfig.getInstance().databaseURL(this.appName)}`, model);
                return this._extractResultFromServer(response.data, 'create', this.domainName);
            } catch (e) {
                throw {message: DomainController._getErrorMessage(e)};
            }
        } else {
            throw {message: 'please provide data to save'};
        }
    }

    async getAll<T>(pagination?: { size: number, skip: number }, options?: RequestOptions): Promise<T[]> {
        try {
            const number = pagination ? pagination.size : await this.query().count({}, options);
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
            return await this.query<T>().get(objectId, options);
        } catch (e) {
            throw {message: DomainController._getErrorMessage(e)};
        }
    }

    async delete<T>(objectId: string, options?: RequestOptions): Promise<T> {
        const deleteRule = {}
        if (options?.useMasterKey) {
            Object.assign(deleteRule, {
                masterKey: BFastConfig.getInstance().getAppCredential(this.appName).appPassword
            });
        }
        Object.assign(deleteRule, {
            applicationId: BFastConfig.getInstance().getAppCredential(this.appName).applicationId,
            [`delete${this.domainName}`]: {
                id: objectId
            }
        });
        try {
            const response = await this.restAdapter.post(BFastConfig.getInstance().databaseURL(this.appName), deleteRule);
            return this._extractResultFromServer(response.data, 'delete', this.domainName);
        } catch (e) {
            throw {message: DomainController._getErrorMessage(e)};
        }
    }

    query<T>(options?: RequestOptions): QueryController<T> {
        return new QueryController<T>(this.domainName, this.cacheAdapter, this.restAdapter, this.appName);
    }

    async update<T>(objectId: string, model: UpdateBuilderController, options?: RequestOptions): Promise<T> {
        const updateRule = {}
        if (options?.useMasterKey) {
            Object.assign(updateRule, {
                masterKey: BFastConfig.getInstance().getAppCredential(this.appName).appPassword
            });
        }
        Object.assign(updateRule, {
            applicationId: BFastConfig.getInstance().getAppCredential(this.appName).applicationId,
            [`update${this.domainName}`]: {
                id: objectId,
                update: model.build(),
                return: options?.returnFields ? options.returnFields : []
            }
        });
        try {
            const response = await this.restAdapter.post(BFastConfig.getInstance().databaseURL(this.appName), updateRule);
            return this._extractResultFromServer(response.data, 'update', this.domainName);
        } catch (e) {
            throw {message: DomainController._getErrorMessage(e)};
        }
    }

    async daasRules(rules: RulesModel): Promise<any> {
        if (!rules.applicationId) {
            rules.applicationId = BFastConfig.getInstance().getAppCredential(this.appName).applicationId;
        }
        if (!rules.masterKey) {
            rules.masterKey = BFastConfig.getInstance().getAppCredential(this.appName).appPassword;
        }
        if (!rules.token) {
            const user = await this.authAdapter.currentUser();
            rules.token = user?.token;
        }
        const value = await this.restAdapter.post(
            BFastConfig.getInstance().databaseURL(this.appName) as string,
            rules,
        );
        return value.data;
    }

    private _extractResultFromServer(data: any, rule: string, domain: string) {
        if (data && data[`${rule}${domain}`]) {
            return data[`${rule}${domain}`];
        } else {
            if (data && data.errors && data.errors[`${rule}`] && data.errors[`${rule}`][domain]) {
                throw data.errors[`${rule}`][`${domain}`];
            } else {
                throw {message: 'Server general failure'};
            }
        }
    }

    private static _getErrorMessage(e: any) {
        if (e.message) {
            return e.message;
        } else {
            return (e && e.response && e.response.data) ? e.response.data : e.toString();
        }
    }
}

