import {QueryModel} from "./QueryModel";

export interface TransactionModel {
    action: 'create' | 'update' | 'delete' | 'query';
    domain: string,
    data: any
}
