export interface DatabaseChangesModel {
    info: string;
    error: string;
    change: {
        name: 'create' | 'update' | 'delete';
        resumeToken: { _id: string },
        snapshot: any
    }
}
