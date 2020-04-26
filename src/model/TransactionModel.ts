import {DomainModel} from "../core/domainInterface";

export interface TransactionModel {
    method: 'POST' | 'PUT' | 'DELETE';
    path: string,
    body: DomainModel
}
