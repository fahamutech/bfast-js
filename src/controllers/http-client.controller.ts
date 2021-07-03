import {HttpClientAdapter, RestRequestConfig, RestResponse} from "../adapters/http-client.adapter";
import {CacheController} from "./cache.controller";

export class HttpClientController {

    constructor(private readonly cacheController: CacheController,
                private readonly httpClientAdapter: HttpClientAdapter) {
    }

    async addTokenToHeaders(config?: RestRequestConfig): Promise<RestRequestConfig> {
        let token;
        const user: any = await this.cacheController.get('_User', {secure: true});
        if (user && typeof user === 'object' && user.token) {
            token = user.token;
        }
        token = token ? token : '';
        return Object.assign(config ? config : {headers: {}}, {
            headers: {
                'x-bfast-token': token.toString().trim()
            }
        });
    }

    async delete<T = any, R = RestResponse<T>>(url: string, config?: RestRequestConfig): Promise<R> {
        config = await this.addTokenToHeaders(config);
        return this.httpClientAdapter.delete(url, config as any);
    }

    async get<T = any, R = RestResponse<T>>(url: string, config?: RestRequestConfig): Promise<R> {
        config = await this.addTokenToHeaders(config);
        return this.httpClientAdapter.get(url, config as any);
    }

    async head<T = any, R = RestResponse<T>>(url: string, config?: RestRequestConfig): Promise<R> {
        config = await this.addTokenToHeaders(config);
        return this.httpClientAdapter.head(url, config as any);
    }

    async options<T = any, R = RestResponse<T>>(url: string, config?: RestRequestConfig): Promise<R> {
        config = await this.addTokenToHeaders(config);
        return this.httpClientAdapter.options(url, config as any);
    }

    async patch<T = any, R = RestResponse<T>>(url: string, data?: any, config?: RestRequestConfig): Promise<R> {
        config = await this.addTokenToHeaders(config);
        return this.httpClientAdapter.patch(url, data, config as any);
    }

    async post<T = any, R = RestResponse<T>>(url: string, data?: any, config?: RestRequestConfig): Promise<R> {
        config = await this.addTokenToHeaders(config);
        return this.httpClientAdapter.post(url, data, config as any);
    }

    async put<T = any, R = RestResponse<T>>(url: string, data?: any, config?: RestRequestConfig): Promise<R> {
        config = await this.addTokenToHeaders(config);
        return this.httpClientAdapter.put(url, data, config as any);
    }

}
