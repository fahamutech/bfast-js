import {QueryModel} from './QueryModel';
import {UpdateModel} from './UpdateOperation';

export interface TransactionModel {
  action: 'create' | 'update' | 'delete' | 'query';
  domain: string;
  data: { query: QueryModel, update: UpdateModel };
}
