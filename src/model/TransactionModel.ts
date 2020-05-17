import {DomainModel} from "../adapters/DomainAdapter";

export interface TransactionModel {
    method: 'POST' | 'PUT' | 'DELETE';
    path: string,
    body: DomainModel
}
