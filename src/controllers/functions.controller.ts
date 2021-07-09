import {BFastConfig} from "../conf";
import {RestRequestConfig} from "../adapters/http-client.adapter";
import {HttpClientController} from "./http-client.controller";

export class FunctionsController {

    constructor(private readonly functionPath: string,
                private readonly httpClientController: HttpClientController,
                private readonly appName = BFastConfig.DEFAULT_APP) {
    }

    async post<T>(body?: { [key: string]: any; }, config?: RestRequestConfig): Promise<T> {
        if (this.functionPath && this.functionPath !== '') {
            const postConfig: RestRequestConfig = {};
            if (config && config.headers) {
                Object.assign(postConfig, config);
            } else {
                Object.assign(postConfig, config);
            }
            // const user = await this.authAdapter.currentUser();
            // postConfig.headers['authorization'] = `Bearer ${user?.sessionToken}`;
            const value = await this.httpClientController.post(
                BFastConfig.getInstance().functionsURL(this.functionPath, this.appName) as string,
                body ? body : {},
                postConfig,
                {
                    context: '_Rest',
                    rule: 'functions',
                    type: 'faas'
                }
            );
            return value.data;
        } else {
            throw {code: -1, message: 'Please provide function path'};
        }
    }

    async delete<T>(config?: RestRequestConfig): Promise<T> {
        const deleteConfig: RestRequestConfig = {};
        if (config && config.headers) {
            Object.assign(deleteConfig, config);
        } else {
            Object.assign(deleteConfig, config);
        }
        const response = await this.httpClientController.delete(
            BFastConfig.getInstance().functionsURL(this.functionPath, this.appName) as string,
            deleteConfig,
            {
                context: '_Rest',
                rule: 'functions',
                type: 'faas'
            }
        );
        return response.data;
    }

    async get<T>(config?: RestRequestConfig): Promise<T> {
        const getConfig: RestRequestConfig = {};
        if (config && config.headers) {
            Object.assign(getConfig, config);
        } else {
            Object.assign(getConfig, config);
        }
        const response = await this.httpClientController.get(
            BFastConfig.getInstance().functionsURL(this.functionPath, this.appName) as string,
            getConfig,
            {
                context: '_Rest',
                rule: 'functions',
                type: 'faas'
            }
        );
        return response.data;
    }

    async put<T>(body?: { [p: string]: any }, config?: RestRequestConfig): Promise<T> {
        const putConfig: RestRequestConfig = {};
        if (config && config.headers) {
            Object.assign(putConfig, config)
        } else {
            Object.assign(putConfig, config);
        }
        const response = await this.httpClientController.put(
            BFastConfig.getInstance().functionsURL(this.functionPath, this.appName) as string,
            body ? body : {},
            putConfig,
            {
                context: '_Rest',
                rule: 'functions',
                type: 'faas'
            }
        );
        return response.data;
    }


}
