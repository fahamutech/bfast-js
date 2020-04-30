import {DomainModel} from "../core/DomainAdapter";

export interface TransactionModel {
    method: 'POST' | 'PUT' | 'DELETE';
    path: string,
    body: DomainModel
}
