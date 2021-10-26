export type SyncsModel = {
    action: 'create' | 'update' | 'delete';
    payload: { id: string, [key: string]: any };
    tree: string;
    databaseURL: string;
    applicationId: string;
    projectId: string;
}
