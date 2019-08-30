import { DomainI, DomainModel } from "../core/domainInterface";
import { Config } from "./configuration";
import { link } from "fs";
var axios = require('axios');

export class DomainController implements DomainI{

    private  domainName: string;
    private model: DomainModel;

    constructor(name: string, private config: Config){
        this.domainName = name;
    }

    set(name: string, value: any): DomainModel {
        this.model[name] = value;
        return this.model;
    }

    setValues(model: DomainModel): DomainModel {
        this.model = model;
        return this.model;
    }

    save(): Promise<any>{
        if(this.model){
            return new Promise<any>((resolve, reject)=>{
                axios.post(this.config.getApiUrl(this.domainName),this.model,{
                    headers: this.config.getHeaders()
                }).then((value: any)=>{
                    resolve(value.data);
                }).catch((reason: any)=>{
                    reject(reason);
                });
            });
        }else{
            return Promise.reject({code: -1, message: 'please provide data to save'});
        }
    }

    many(options?: {[name: string]: any}): Promise<any>{
        return new Promise((resolve, reject)=>{
           //  console.log(this.domainName);
            axios.get(this.config.getApiUrl(this.domainName), {
                headers: this.config.getHeaders(),
                params: options?options:{},
            }).then((values: any)=>{
                const domains = this.config.parseApiUrl(values.data);
                resolve({
                    [this.domainName]: domains._embedded[this.domainName],
                    links: domains._links,
                    page: domains.page
                })
            }).catch((reason: any)=>{
                reject(reason);
            });
        });
    }

    one(options: {link: string, id: string}): Promise<any>{
        return new Promise((resolve, reject)=>{
            if(options.link){
               axios.get(options.link, {
                   headers: this.config.getHeaders
               }).then((value:any)=>{
                   const domain = this.config.parseApiUrl(value.data);
                   resolve({
                       [this.domainName]: domain
                   });
               }).catch((reason: any)=>{
                   reject(reason);
               });
            }else if(options.id){
                axios.get(`${this.config.getApiUrl(this.domainName)}/${options.id}`, {
                    headers: this.config.getHeaders
                }).then((value:any)=>{
                    const domain = this.config.parseApiUrl(value.data);
                    resolve({
                        [this.domainName]: domain
                    });
                }).catch((reason: any)=>{
                    reject(reason);
                });
            }else{
                reject({code: -1, message: 'either id or link is required'});
            }
        });
    }

    navigate(link: string): Promise<any>{
        return new Promise((resolve, reject)=>{
            if(link){
                axios.get(link, {
                    headers: this.config.getHeaders
                }).then((values: any)=>{
                    const domains = this.config.parseApiUrl(values.data);
                    resolve({
                        [this.domainName]: domains._embedded?domains._embedded[this.domainName]:domains,
                        links: domains._links?domains._links:null,
                        page: domains.page?domains.page:null
                    });
                }).catch((reason: any)=>{
                    reject(reason);
                })
            }else{
                reject({code: -1, message: 'Please provide a link of a resource'});
            }
        });
    }
}

