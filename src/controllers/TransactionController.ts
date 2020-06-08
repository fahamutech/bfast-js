import {TransactionAdapter} from "../adapters/TransactionAdapter";
import {TransactionModel} from "../model/TransactionModel";
import {BFastConfig} from "../conf";
import {DeleteOperation} from "../model/DeleteOperation";
import {UpdateOperation} from "../model/UpdateOperation";
import {RestAdapter} from "../adapters/RestAdapter";

export class TransactionController implements TransactionAdapter {

    private transactionRequests: TransactionModel[];

    constructor(private readonly appName: string,
                private readonly restApi: RestAdapter,
                private readonly isNormalBatch = false) {
        this.transactionRequests = [];
    }

    async commit(options?: {
        before: (transactionRequests: TransactionModel[]) => Promise<TransactionModel[]>,
        after?: () => Promise<void>,
        useMasterKey?: boolean
    }): Promise<any> {
        if (this.transactionRequests.length === 0) {
            throw new Error('You can not commit an empty transaction');
        }
        if (options && options.before) {
           const result =  await options.before(this.transactionRequests);
           if (result && Array.isArray(result) && result.length>0 && result[0].body && result[0].path && result[0].method) {
               this.transactionRequests = result;
           }
        }
        const response = await this.restApi.post(`${BFastConfig.getInstance().databaseURL(this.appName, '/batch')}`, {
            requests: this.transactionRequests,
            transaction: !this.isNormalBatch,
        }, {
            headers: (options && options.useMasterKey === true)
                ? BFastConfig.getInstance().getMasterHeaders(this.appName)
                : BFastConfig.getInstance().getHeaders(this.appName),
        });
        this.transactionRequests.splice(0);
        if (options && options.after) {
            await options.after();
        }
        return response.data;
    }

    create(domainName: string, data: Object): TransactionAdapter {
        this.transactionRequests.push({
            body: data,
            method: "POST",
            path: `/classes/${domainName}`
        });
        return this;
    }

    createMany(domainName: string, data: Object[]): TransactionAdapter {
        const trans = data.map<TransactionModel>(payLoad => {
            return {
                body: payLoad,
                method: "POST",
                path: `/classes/${domainName}`
            }
        });
        this.transactionRequests.push(...trans);
        return this;
    }

    delete(domainName: string, payLoad: { objectId: string, data?: DeleteOperation }): TransactionAdapter {
        this.transactionRequests.push({
            body: payLoad.data ? payLoad.data : {},
            method: "DELETE",
            path: `/classes/${domainName}/${payLoad.objectId}`
        });
        return this;
    }

    deleteMany(domainName: string, payLoads: { objectId: string, data?: DeleteOperation }[]): TransactionAdapter {
        const trans = payLoads.map<TransactionModel>(payLoad => {
            return {
                body: payLoad.data ? payLoad.data : {},
                method: "DELETE",
                path: `/classes/${domainName}/${payLoad.objectId}`
            }
        });
        this.transactionRequests.push(...trans);
        return this;
    }

    update(domainName: string, payLoad: { objectId: string, data: UpdateOperation }): TransactionAdapter {
        this.transactionRequests.push({
            body: payLoad.data,
            method: "PUT",
            path: `/classes/${domainName}/${payLoad.objectId}`
        });
        return this;
    }

    updateMany(domainName: string, payLoads: { objectId: string, data: UpdateOperation }[]): TransactionAdapter {
        const trans = payLoads.map<TransactionModel>(payLoad => {
            return {
                body: payLoad.data,
                method: "PUT",
                path: `/classes/${domainName}/${payLoad.objectId}`
            }
        });
        this.transactionRequests.push(...trans);
        return this;
    }

}
