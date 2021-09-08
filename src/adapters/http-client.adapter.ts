import {HttpRequestInfoModel} from "../models/http-request-info.model"

export abstract class HttpClientAdapter {
    abstract get<T = any, R = RestResponse<T>>(url: string, config: RestRequestConfig, info: HttpRequestInfoModel): Promise<R>;

    abstract delete<T = any, R = RestResponse<T>>(url: string, config: RestRequestConfig, info: HttpRequestInfoModel): Promise<R>;

    abstract head<T = any, R = RestResponse<T>>(url: string, config: RestRequestConfig, info: HttpRequestInfoModel): Promise<R>;

    abstract options<T = any, R = RestResponse<T>>(url: string, config: RestRequestConfig, info: HttpRequestInfoModel): Promise<R>;

    abstract post<T = any, R = RestResponse<T>>(url: string, data: any, config: RestRequestConfig, info: HttpRequestInfoModel): Promise<R>;

    abstract put<T = any, R = RestResponse<T>>(url: string, data: any, config: RestRequestConfig, info: HttpRequestInfoModel): Promise<R>;

    abstract patch<T = any, R = RestResponse<T>>(url: string, data: any, config: RestRequestConfig, info: HttpRequestInfoModel): Promise<R>;
}

export interface RestResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: RestRequestConfig;
    request?: any;
}

export interface RestError<T = any> extends Error {
    config: RestRequestConfig;
    code?: string;
    request?: any;
    response?: RestResponse<T>;
    isAxiosError: boolean;
    toJSON: () => object;
}

export interface RestRequestConfig {
    url?: string;
    method?: RestMethod;
    baseURL?: string;
    headers?: any;
    params?: any;
    paramsSerializer?: (params: any) => string;
    data?: any;
    timeout?: number;
    timeoutErrorMessage?: string;
    withCredentials?: boolean;
    auth?: RestBasicCredentials;
    responseType?: ResponseType;
    xsrfCookieName?: string;
    xsrfHeaderName?: string;
    onUploadProgress?: (progressEvent: any) => void;
    onDownloadProgress?: (progressEvent: any) => void;
    maxContentLength?: number;
    validateStatus?: (status: number) => boolean;
    maxRedirects?: number;
    socketPath?: string | null;
    httpAgent?: any;
    httpsAgent?: any;
}

export type RestMethod =
    | 'get' | 'GET'
    | 'delete' | 'DELETE'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'
    | 'link' | 'LINK'
    | 'unlink' | 'UNLINK'

export type RestResponseType =
    | 'arraybuffer'
    | 'blob'
    | 'document'
    | 'json'
    | 'text'
    | 'stream'

export interface RestBasicCredentials {
    username: string;
    password: string;
}
