export interface SnapshotModel {
    _id: string,
    createdAt?: any,
    updatedAt?: any,
    docs: {
        [key: string]: {
            _id: string,
            [key: string]: any
        }
    }
}
