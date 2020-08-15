import {AppCredentials} from "../conf";
import {RequestOptions} from "../adapters/QueryAdapter";
import {TransactionModel} from "../model/TransactionModel";
import {AuthAdapter} from "../adapters/AuthAdapter";
import {QueryModel} from "../model/QueryModel";
import {UpdateModel} from "../model/UpdateOperation";

export class RulesController {
    constructor(private readonly authAdapter: AuthAdapter) {
    }

    async createRule(domain: string, data: any, appCredential: AppCredentials, options?: RequestOptions): Promise<Object> {
        const createRule = {};
        if (options && options?.useMasterKey === true) {
            Object.assign(createRule, {
                masterKey: appCredential.appPassword
            });
        }
        Object.assign(createRule, {
            applicationId: appCredential.applicationId
        });
        if (data !== null && data !== undefined) {
            if (Array.isArray(data)) {
                data.map(x => {
                    x.return = options?.returnFields ? options.returnFields : [];
                    return x;
                });
            } else {
                data.return = options?.returnFields ? options.returnFields : [];
            }
            Object.assign(createRule, {
                [`create${domain}`]: data
            });
            return this.addToken(createRule);
        } else {
            throw {message: 'please provide data to save'};
        }
    }

    async deleteRule(domain: string, query: QueryModel, appCredential: AppCredentials, options?: RequestOptions): Promise<Object> {
        const deleteRule = {}
        if (options && options?.useMasterKey === true) {
            Object.assign(deleteRule, {
                masterKey: appCredential.appPassword
            });
        }
        Object.assign(deleteRule, {
            applicationId: appCredential.applicationId,
            [`delete${domain}`]: query
        });
        return this.addToken(deleteRule);
    }

    async updateRule(domain: string, query: QueryModel, updateModel: UpdateModel,
                     appCredential: AppCredentials, options?: RequestOptions): Promise<Object> {
        const updateRule = {}
        if (options && options?.useMasterKey === true) {
            Object.assign(updateRule, {
                masterKey: appCredential.appPassword
            });
        }
        query.return = options?.returnFields ? options.returnFields : []
        Object.assign(query, {
            update: updateModel
        });
        Object.assign(updateRule, {
            applicationId: appCredential.applicationId,
            [`update${domain}`]: query
        });
        return this.addToken(updateRule);
    }

    async aggregateRule(domain: string, pipeline: any[], appCredentials: AppCredentials, options?: RequestOptions): Promise<Object> {
        const aggregateRule = {};
        if (options && options?.useMasterKey === true) {
            Object.assign(aggregateRule, {
                'masterKey': appCredentials.appPassword
            });
        }
        Object.assign(aggregateRule, {
            applicationId: appCredentials.applicationId,
            [`aggregate${domain}`]: pipeline
        });
        return this.addToken(aggregateRule);
    }

    async queryRule(domain: string, queryModel: QueryModel, appCredentials: AppCredentials, options?: RequestOptions): Promise<Object> {
        const queryRule = {};
        if (options && options?.useMasterKey === true) {
            Object.assign(queryRule, {
                'masterKey': appCredentials.appPassword
            });
        }
        queryModel.return = options?.returnFields ? options.returnFields : [];
        Object.assign(queryRule, {
            applicationId: appCredentials.applicationId,
            [`query${domain}`]: queryModel
        });
        return this.addToken(queryRule);
    }

    async transaction(transactions: TransactionModel[], appCredentials: AppCredentials, options?: RequestOptions): Promise<Object> {
        const transactionRule = {
            transaction: {
                commit: {}
            }
        };
        if (options && options?.useMasterKey === true) {
            Object.assign(transactionRule, {
                'masterKey': appCredentials.appPassword
            });
        }
        Object.assign(transactionRule, {
            applicationId: appCredentials.applicationId,
        });
        for (const value of transactions) {
            if (value.action === "create") {
                const createRule: any = await this.createRule(value.domain, value.data, appCredentials, options);
                Object.assign(transactionRule.transaction.commit, {
                    [`${value.action}${value.domain}`]: createRule[`${value.action}${value.domain}`]
                });
            } else if (value.action === "update") {
                const updateRule: any = await this.updateRule(value.domain, value.data['query'], value.data['updateModel'], appCredentials, options);
                Object.assign(transactionRule.transaction.commit, {
                    [`${value.action}${value.domain}`]: updateRule[`${value.action}${value.domain}`]
                });
            } else if (value.action === "delete") {
                const deleteQuery: any = await this.deleteRule(value.domain, value.data['query'], appCredentials, options);
                Object.assign(transactionRule.transaction.commit, {
                    [`${value.action}${value.domain}`]: deleteQuery[`${value.action}${value.domain}`]
                });
            }
        }
        return this.addToken(transactionRule);
    }

    async storage(action: 'save' | 'list' | 'delete', payload: any, appCredentials: AppCredentials, options?: RequestOptions): Promise<Object> {
        const storageRule = {};
        if (options && options?.useMasterKey === true) {
            Object.assign(storageRule, {
                'masterKey': appCredentials.appPassword
            });
        }
        Object.assign(storageRule, {
            applicationId: appCredentials.applicationId,
            files: {
                [action]: payload
            }
        });
        return this.addToken(storageRule);
    }

    async addToken(rule: any): Promise<any> {
        const token = await this.authAdapter.getToken();
        Object.assign(rule, {
            token
        });
        return rule;
    }
}
