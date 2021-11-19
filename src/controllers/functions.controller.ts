import {BFastConfig} from "../conf";
import {RestRequestConfig} from "../adapters/http-client.adapter";
import {HttpClientController} from "./http-client.controller";
import {AuthController} from "./auth.controller";
import {getConfig} from '../bfast';

export class FunctionsController {

    constructor(private readonly functionPath: string,
                private readonly httpClientController: HttpClientController,
                private readonly authController: AuthController,
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
            return this.httpClientController.post(
                getConfig().functionsURL(this.functionPath, this.appName) as string,
                body ? body : {},
                postConfig,
                {
                    context: '_Rest',
                    rule: 'functions',
                    type: 'faas',
                    token: await this.authController.getToken()
                }
            ).then(response => {
                return response.data;
            }).catch(reason => {
                throw reason && reason.response && reason.response.data
                    ? reason.response.data
                    : {message: reason.toString()};
            });
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
        return this.httpClientController.delete(
            getConfig().functionsURL(this.functionPath, this.appName) as string,
            deleteConfig,
            {
                context: '_Rest',
                rule: 'functions',
                type: 'faas',
                token: await this.authController.getToken()
            }
        ).then(response => {
            return response.data;
        }).catch(reason => {
            throw reason && reason.response && reason.response.data
                ? reason.response.data
                : {message: reason.toString()};
        });
    }

    async get<T>(config?: RestRequestConfig): Promise<T> {
        const getConfig_: RestRequestConfig = {};
        if (config && config.headers) {
            Object.assign(getConfig_, config);
        } else {
            Object.assign(getConfig_, config);
        }
        return this.httpClientController.get(
            getConfig().functionsURL(this.functionPath, this.appName) as string,
            getConfig_,
            {
                context: '_Rest',
                rule: 'functions',
                type: 'faas',
                token: await this.authController.getToken()
            }
        ).then(response => {
            return response.data;
        }).catch(reason => {
            throw reason && reason.response && reason.response.data
                ? reason.response.data
                : {message: reason.toString()};
        });
    }

    async put<T>(body?: { [p: string]: any }, config?: RestRequestConfig): Promise<T> {
        const putConfig: RestRequestConfig = {};
        if (config && config.headers) {
            Object.assign(putConfig, config)
        } else {
            Object.assign(putConfig, config);
        }
        return this.httpClientController.put(
            getConfig().functionsURL(this.functionPath, this.appName) as string,
            body ? body : {},
            putConfig,
            {
                context: '_Rest',
                rule: 'functions',
                type: 'faas',
                token: await this.authController.getToken()
            }
        ).then(response => {
            return response.data;
        }).catch(reason => {
            throw reason && reason.response && reason.response.data
                ? reason.response.data
                : {message: reason.toString()};
        });
    }


}
