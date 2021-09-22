export interface SnapshotModel {
    _id: string,
    docs: {
        [key: string]: {
            _id: string,
            [key: string]: any
        }
    }
}
