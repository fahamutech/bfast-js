import {DeleteOperation} from "../model/DeleteOperation";
import {UpdateOperation} from "../model/UpdateOperation";
import {TransactionModel} from "../model/TransactionModel";

export interface TransactionAdapter {
    create(domainName: string, data: Object): TransactionAdapter;

    createMany(domainName: string, data: Object[]): TransactionAdapter;

    update(domainName: string, payLoad: { objectId: string, data: UpdateOperation }): TransactionAdapter;

    updateMany(domainName: string, payLoads: { objectId: string, data: UpdateOperation }[]): TransactionAdapter;

    delete(domainName: string, payLoad: { objectId: string, data?: DeleteOperation }): TransactionAdapter;

    deleteMany(domainName: string, payLoads: { objectId: string, data?: DeleteOperation }[]): TransactionAdapter;

    commit(options?: {
        before: (transactionRequests: TransactionModel[]) => Promise<TransactionModel[]>,
        after?: () => Promise<void>,
        useMasterKey?: boolean
    }): Promise<any>;
}
