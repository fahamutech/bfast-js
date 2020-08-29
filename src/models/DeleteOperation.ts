export interface DeleteOperation {
    [field: string]: { __op: "Delete", amount: number };
}
