export interface FunctionAdapter {
    post<T>(body?: { [key: string]: any }, query?: { [key: string]: any }, headers?: { [p: string]: any }): Promise<T>;

    get<T>(query?: { [key: string]: any }, headers?: { [p: string]: any }): Promise<T>;

    delete<T>(query?: { [key: string]: any }, headers?: { [p: string]: any }): Promise<T>;

    put<T>(body?: { [key: string]: any }, query?: { [key: string]: any }, headers?: { [p: string]: any }): Promise<T>;
}
