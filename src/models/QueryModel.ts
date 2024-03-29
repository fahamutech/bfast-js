export interface QueryModel {
    skip?: number;
    size?: number;
    orderBy?: Array<object>;
    filter?: any;
    cids?: boolean;
    return?: Array<string>;
    count?: boolean,
    last?: number,
    first?: number
    id?: string;
    update?: any,
    upsert?: boolean
    hashes?: string[]
}
