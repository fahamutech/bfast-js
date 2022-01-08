import {HttpClientAdapter, RestRequestConfig, RestResponse} from "../adapters/http-client.adapter";
import {HttpRequestInfoModel} from "../models/http-request-info.model";

export class HttpClientController {

    constructor(
        private readonly appName: string,
        private readonly httpClientAdapter: HttpClientAdapter) {
    }

    async addTokenToHeaders(
        config: RestRequestConfig,
        token: string | null,
    ): Promise<RestRequestConfig> {
        // token = token ? token : '';
        // const headers = Object.assign(config && config.headers ? config.headers : {}, {
        //     'x-bfast-token': token.toString().trim()
        // });
        if (config) {
            // config.headers = headers;
            return config;
        } else {
            return {}
        }
    }

    async delete<T = any, R = RestResponse<T>>(
        url: string,
        config: RestRequestConfig,
        requestInfoModel: HttpRequestInfoModel
    ): Promise<R> {
        config = await this.addTokenToHeaders(config, requestInfoModel.token);
        return this.httpClientAdapter.delete(url, config as any, requestInfoModel);
    }

    async get<T = any, R = RestResponse<T>>(
        url: string,
        config: RestRequestConfig,
        requestInfoModel: HttpRequestInfoModel): Promise<R> {
        config = await this.addTokenToHeaders(config, requestInfoModel.token);
        return this.httpClientAdapter.get(url, config as any, requestInfoModel);
    }

    async head<T = any, R = RestResponse<T>>(
        url: string,
        config: RestRequestConfig,
        requestInfoModel: HttpRequestInfoModel): Promise<R> {
        config = await this.addTokenToHeaders(config, requestInfoModel.token);
        return this.httpClientAdapter.head(url, config as any, requestInfoModel);
    }

    async options<T = any, R = RestResponse<T>>(
        url: string,
        config: RestRequestConfig,
        requestInfoModel: HttpRequestInfoModel
    ): Promise<R> {
        config = await this.addTokenToHeaders(config, requestInfoModel.token);
        return this.httpClientAdapter.options(url, config as any, requestInfoModel);
    }

    async patch<T = any, R = RestResponse<T>>(
        url: string,
        data: any,
        config: RestRequestConfig,
        requestInfoModel: HttpRequestInfoModel
    ): Promise<R> {
        config = await this.addTokenToHeaders(config, requestInfoModel.token);
        return this.httpClientAdapter.patch(url, data, config as any, requestInfoModel);
    }

    async post<T = any, R = RestResponse<T>>(
        url: string,
        data: any,
        config: RestRequestConfig,
        requestInfoModel: HttpRequestInfoModel
    ): Promise<R> {
        config = await this.addTokenToHeaders(config, requestInfoModel.token);
        return this.httpClientAdapter.post(url, data, config as any, requestInfoModel);
    }

    async put<T = any, R = RestResponse<T>>(
        url: string,
        data: any,
        config: RestRequestConfig,
        requestInfoModel: HttpRequestInfoModel
    ): Promise<R> {
        config = await this.addTokenToHeaders(config, requestInfoModel.token);
        return this.httpClientAdapter.put(url, data, config as any, requestInfoModel);
    }

}
