export interface SyncsModel{
    action: 'create' | 'update' | 'delete',
    payload: { [key: string]: any },
    tree: string
}
