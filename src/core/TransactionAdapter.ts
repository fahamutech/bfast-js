import {DeleteOperation} from "../model/DeleteOperation";
import {UpdateOperation} from "../model/UpdateOperation";

export interface TransactionAdapter {
    create(domainName: string, data: Object): TransactionAdapter;

    createMany(domainName: string, data: Object[]): TransactionAdapter;

    update(domainName: string, payLoad: { objectId: string, data: UpdateOperation }): TransactionAdapter;

    updateMany(domainName: string, payLoads: { objectId: string, data: UpdateOperation }[]): TransactionAdapter;

    delete(domainName: string, payLoad: { objectId: string, data?: DeleteOperation }): TransactionAdapter;

    deleteMany(domainName: string, payLoads: { objectId: string, data?: DeleteOperation }[]): TransactionAdapter;

    commit(): Promise<any>;
}