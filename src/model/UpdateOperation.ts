export interface UpdateOperation {
    [field: string]:
        { __op: "Increment", amount: number }
        | { __op: "Add", objects: any[] }
        | { __op: "Remove", objects: any[] }
        | { __op: "AddUnique", objects: any[] }
        | { __op: "AddRelation", objects: { __type: "Pointer", className: string, objectId: string }[] }
        | { __op: "RemoveRelation", objects: { __type: "Pointer", className: string, objectId: string }[] }
        | string
        | number
        | object
}
