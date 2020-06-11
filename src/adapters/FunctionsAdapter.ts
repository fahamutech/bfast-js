export interface FunctionAdapter {
    post<T>(body?: { [key: string]: any }, config?: { [key: string]: any }): Promise<T>;

    get<T>(config?: { [key: string]: any }): Promise<T>;

    delete<T>(config?: { [key: string]: any }): Promise<T>;

    put<T>(body?: { [key: string]: any }, config?: { [key: string]: any }): Promise<T>;
}
