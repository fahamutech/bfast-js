import {HttpClientAdapter, RestRequestConfig, RestResponse} from "../adapters/http-client.adapter";

// @ts-ignore
import axios from "axios";

export class DefaultHttpClientFactory implements HttpClientAdapter {

    async delete<T = any, R = RestResponse<T>>(url: string, config?: RestRequestConfig): Promise<R> {
        return axios.delete(url, config as any);
    }

    async get<T = any, R = RestResponse<T>>(url: string, config?: RestRequestConfig): Promise<R> {
        return axios.get(url, config as any);
    }

    async head<T = any, R = RestResponse<T>>(url: string, config?: RestRequestConfig): Promise<R> {
        return axios.head(url, config as any);
    }

    async options<T = any, R = RestResponse<T>>(url: string, config?: RestRequestConfig): Promise<R> {
        return axios.options(url, config as any);
    }

    async patch<T = any, R = RestResponse<T>>(url: string, data?: any, config?: RestRequestConfig): Promise<R> {
        return axios.patch(url, data, config as any);
    }

    async post<T = any, R = RestResponse<T>>(url: string, data?: any, config?: RestRequestConfig): Promise<R> {
        return axios.post(url, data, config as any);
    }

    async put<T = any, R = RestResponse<T>>(url: string, data?: any, config?: RestRequestConfig): Promise<R> {
        return axios.put(url, data, config as any);
    }

}
