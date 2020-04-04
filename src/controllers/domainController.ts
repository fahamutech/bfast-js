import {DomainI, DomainModel} from "../core/domainInterface";
import {BFastConfig} from "../conf";
import {QueryController} from "./QueryController";

const axios = require('axios').default;

export class DomainController implements DomainI {

    domainName: string;
    private readonly cloudObj: Parse.Object;

    constructor(private name: string, private _parse: any) {
        this.domainName = name;
        const CloudObj = _parse.Object.extend(this.domainName);
        this.cloudObj = new CloudObj;
    }

    async save(model: DomainModel): Promise<any> {
        if (model) {
            try {
                const response = await this.cloudObj.save(model);
                return response.toJSON();
            } catch (e) {
                throw e;
            }
        } else {
            return Promise.reject({code: -1, message: 'please provide data to save'});
        }
    }

    async getAll(): Promise<any> {
        try {
            const number = await this.query().count();
            const response = await this.query().limit(number).find();
            return JSON.parse(JSON.stringify(response));
        } catch (e) {
            throw e;
        }
    }


    async get<T>(objectId: string): Promise<any> {
        try {
            const response = await this.query().get(objectId);
            return response.toJSON();
        } catch (e) {
            throw e;
        }
    }

    async delete(objectId: string): Promise<any> {
        try {
            console.log(`${BFastConfig.getCloudDatabaseUrl()}/classes/${this.domainName}/${objectId}`);
            const response = await axios.delete(`${BFastConfig.getCloudDatabaseUrl()}/classes/${this.domainName}/${objectId}`, {
                headers: BFastConfig.getHeaders()
            });
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    query(): Parse.Query {
        try {
            return new QueryController(this.domainName);
            // this._parse.Query(this.domainName);
        } catch (e) {
            throw e;
        }
    }

    async update(objectId: string, model: DomainModel): Promise<Parse.Object> {
        try {
            const response = await axios.put(`${BFastConfig.getCloudDatabaseUrl()}/classes/${this.domainName}/${objectId}`,
                model,
                {
                    headers: BFastConfig.getHeaders()
                });
            return response.data;
        } catch (e) {
            throw e;
        }
    }

}

