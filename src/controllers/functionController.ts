import {FunctionAdapter} from "../core/functionInterface";
import {BFastConfig} from "../conf";

const axios = require('axios');

export class FunctionController implements FunctionAdapter {


    constructor(private readonly functionPath: string) {
    }

    async post(body?: { [key: string]: any; }, query?: { [key: string]: any }, headers?: { [key: string]: any; }): Promise<any> {
        try {
            if (this.functionPath && this.functionPath !== '') {
                const value = await axios.post(
                    BFastConfig.getInstance().getCloudFunctionsUrl(this.functionPath),
                    body ? body : {},
                    {
                        headers: headers ? headers : BFastConfig.getInstance().getHeaders(),
                        params: query ? query : {}
                    }
                );
                return value.data;
            } else {
                throw {code: -1, message: 'Please provide function path'};
            }
        } catch (e) {
            throw (e && e.data) ? e.data : e;
        }
    }

    async delete<T>(query?: { [p: string]: any }, headers?: { [p: string]: any }): Promise<T> {
        try {
            const response = await axios.delete(BFastConfig.getInstance().getCloudFunctionsUrl(this.functionPath), {
                    headers: headers ? headers : BFastConfig.getInstance().getHeaders(),
                    params: query
                }
            );
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    async get<T>(query?: { [p: string]: any }, headers?: { [p: string]: any }): Promise<T> {
        try {
            const response = await axios.get(BFastConfig.getInstance().getCloudFunctionsUrl(this.functionPath), {
                headers: headers ? headers : BFastConfig.getInstance().getHeaders(),
                params: query
            });
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    async put<T>(body?: { [p: string]: any }, query?: { [key: string]: any }, headers?: { [p: string]: any }): Promise<T> {
        try {
            const response = await axios.put(BFastConfig.getInstance().getCloudFunctionsUrl(this.functionPath),
                body ? body : {},
                {
                    headers: headers ? headers : BFastConfig.getInstance().getHeaders(),
                    params: query ? query : {}
                }
            );
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    // names(): Promise<any> {
    //     // console.log(`${this.config.getFaasApi()}/names`);
    //     return new Promise((resolve, reject) => {
    //         axios.post(`${this.config.getFaasApi()}/names`, {}, {
    //             headers: this.config.getHeaders()
    //         }).then((value: any) => {
    //             resolve(value.data);
    //         }).catch((reason: any) => {
    //             reject(reason);
    //         });
    //     });
    // }

}
