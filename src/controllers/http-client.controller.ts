import { HttpClientAdapter, RestRequestConfig, RestResponse } from "../adapters/http-client.adapter";
import bfast from "../bfast";
import { HttpRequestInfoModel } from "../models/http-request-info.model";

export class HttpClientController {

    constructor(
        private readonly appName: string,
        private readonly httpClientAdapter: HttpClientAdapter) {
    }

    async addTokenToHeaders(
        config: RestRequestConfig,
        user: { token?: string } = {}
    ): Promise<RestRequestConfig> {
        let token;
        user = (user && user.token) ? user : await bfast.auth(this.appName).currentUser();
        if (user && typeof user === 'object' && user.token) {
            token = user.token;
        }
        token = token ? token : '';
        return Object.assign(config ? config : { headers: {} }, {
            headers: {
                'x-bfast-token': token.toString().trim()
            }
        });
    }

    async delete<T = any, R = RestResponse<T>>(
        url: string,
        config: RestRequestConfig,
        requestInfoModel: HttpRequestInfoModel
    ): Promise<R> {
        config = await this.addTokenToHeaders(config);
        return this.httpClientAdapter.delete(url, config as any, requestInfoModel);
    }

    async get<T = any, R = RestResponse<T>>(
        url: string,
        config: RestRequestConfig,
        requestInfoModel: HttpRequestInfoModel): Promise<R> {
        config = await this.addTokenToHeaders(config);
        return this.httpClientAdapter.get(url, config as any, requestInfoModel);
    }

    async head<T = any, R = RestResponse<T>>(
        url: string,
        config: RestRequestConfig,
        requestInfoModel: HttpRequestInfoModel): Promise<R> {
        config = await this.addTokenToHeaders(config);
        return this.httpClientAdapter.head(url, config as any, requestInfoModel);
    }

    async options<T = any, R = RestResponse<T>>(
        url: string,
        config: RestRequestConfig,
        requestInfoModel: HttpRequestInfoModel
    ): Promise<R> {
        config = await this.addTokenToHeaders(config);
        return this.httpClientAdapter.options(url, config as any, requestInfoModel);
    }

    async patch<T = any, R = RestResponse<T>>(
        url: string,
        data: any,
        config: RestRequestConfig,
        requestInfoModel: HttpRequestInfoModel
    ): Promise<R> {
        config = await this.addTokenToHeaders(config);
        return this.httpClientAdapter.patch(url, data, config as any, requestInfoModel);
    }

    async post<T = any, R = RestResponse<T>>(
        url: string,
        data: any,
        config: RestRequestConfig,
        requestInfoModel: HttpRequestInfoModel
    ): Promise<R> {
        config = await this.addTokenToHeaders(config);
        return this.httpClientAdapter.post(url, data, config as any, requestInfoModel);
    }

    async put<T = any, R = RestResponse<T>>(
        url: string,
        data: any,
        config: RestRequestConfig,
        requestInfoModel: HttpRequestInfoModel
    ): Promise<R> {
        config = await this.addTokenToHeaders(config);
        return this.httpClientAdapter.put(url, data, config as any, requestInfoModel);
    }

}
