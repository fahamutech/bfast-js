import {RestAdapter, RestRequestConfig, RestResponse} from "../adapters/RestAdapter";

export class RestController implements RestAdapter {

    constructor() {
    }

    async delete<T = any, R = RestResponse<T>>(url: string, config?: RestRequestConfig): Promise<R> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("DELETE", url, true);
            xhr.onload = function () {
                const response = JSON.parse(xhr.responseText);
                if (xhr.readyState === 4 && xhr.status === "200") {
                    resolve(response);
                } else {
                    reject(response);
                }
            }
        })
    }

    get<T = any, R = RestResponse<T>>(url: string, config?: RestRequestConfig): Promise<R> {
        return Promise.resolve(undefined);
    }

    head<T = any, R = RestResponse<T>>(url: string, config?: RestRequestConfig): Promise<R> {
        return Promise.resolve(undefined);
    }

    options<T = any, R = RestResponse<T>>(url: string, config?: RestRequestConfig): Promise<R> {
        return Promise.resolve(undefined);
    }

    patch<T = any, R = RestResponse<T>>(url: string, data?: any, config?: RestRequestConfig): Promise<R> {
        return Promise.resolve(undefined);
    }

    post<T = any, R = RestResponse<T>>(url: string, data?: any, config?: RestRequestConfig): Promise<R> {
        return Promise.resolve(undefined);
    }

    put<T = any, R = RestResponse<T>>(url: string, data?: any, config?: RestRequestConfig): Promise<R> {
        return Promise.resolve(undefined);
    }

}