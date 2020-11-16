export interface QueryModel {
  skip?: number;
  size?: number;
  orderBy?: Array<object>;
  filter?: any;
  return?: Array<string>;
  count?: boolean;
  last?: number;
  first?: number;
  id?: string;
}
