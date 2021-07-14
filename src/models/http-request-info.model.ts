export interface HttpRequestInfoModel{
    context: string,
    type: 'daas' | 'faas',
    rule: string,
    token: string | null
}
