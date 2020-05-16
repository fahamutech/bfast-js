import {RestAdapter, RestRequestConfig, RestResponse} from "../adapters/RestAdapter";

const axios = require('axios').default;

export class AxiosRestController implements RestAdapter {

    async delete<T = any, R = RestResponse<T>>(url: string, config?: RestRequestConfig): Promise<R> {
        return axios.delete(url, config);
    }

    async get<T = any, R = RestResponse<T>>(url: string, config?: RestRequestConfig): Promise<R> {
        return axios.get(url, config);
    }

    async head<T = any, R = RestResponse<T>>(url: string, config?: RestRequestConfig): Promise<R> {
        return axios.head(url, config);
    }

    async options<T = any, R = RestResponse<T>>(url: string, config?: RestRequestConfig): Promise<R> {
        return axios.options(url, config);
    }

    async patch<T = any, R = RestResponse<T>>(url: string, data?: any, config?: RestRequestConfig): Promise<R> {
        return axios.patch(url, data, config);
    }

    async post<T = any, R = RestResponse<T>>(url: string, data?: any, config?: RestRequestConfig): Promise<R> {
        return axios.post(url, data, config);
    }

    async put<T = any, R = RestResponse<T>>(url: string, data?: any, config?: RestRequestConfig): Promise<R> {
        return axios.put(url, data, config);
    }

}