import { FunctionI } from "../core/functionInterface";
import { Config } from "../configuration";
var axios = require('axios');

export class FunctionController implements FunctionI{

    functionName: string;

    constructor(name: string, private config: Config){
        this.functionName = name
    }

    run(body?: { [key: string]: any; }): Promise<any> {
       return new Promise((resolve, reject)=>{
            if(this.functionName && this.functionName !==''){
                axios.post(this.config.getFunctionApi(this.functionName), body?body:{}, {
                    headers: this.config.getHeaders()
                }).then((value: any)=>{
                    resolve(value.data);
                }).catch((reason: any)=>{
                    reject(reason);
                });
            }else{
                reject({code: -1, message: 'Please provide function name'});
            }
       });
    }

    names(): Promise<any>{
        // console.log(`${this.config.getFaasApi()}/names`);
        return new Promise((resolve, reject)=>{
            axios.post(`${this.config.getFaasApi()}/names`,{},{
                headers: this.config.getHeaders()
            }).then((value: any)=>{
                resolve(value.data);
            }).catch((reason: any)=>{
                reject(reason);
            });
        });
    }

}