import {QueryController} from "./QueryController";
import {BFastConfig} from "../conf";
import {HttpClientAdapter} from "../adapters/HttpClientAdapter";
import {RequestOptions} from "../adapters/QueryAdapter";
import {AuthAdapter} from "../adapters/AuthAdapter";
import {UpdateBuilderController} from "./UpdateBuilderController";
import {QueryBuilder} from "./QueryBuilder";
import {RulesController} from "./RulesController";
import {PipelineBuilder} from "./PipelineBuilder";
import {SocketController} from "./SocketController";

export class DatabaseController {

    constructor(private readonly domainName: string,
                private readonly restAdapter: HttpClientAdapter,
                private readonly authAdapter: AuthAdapter,
                private readonly rulesController: RulesController,
                private readonly appName: string) {
    }

    async save<T>(model: T | T[], options?: RequestOptions): Promise<T> {
        const createRule = await this.rulesController.createRule(this.domainName, model,
            BFastConfig.getInstance().getAppCredential(this.appName), options);
        const response = await this.restAdapter.post(
            `${BFastConfig.getInstance().databaseURL(this.appName)}`, createRule);
        return DatabaseController._extractResultFromServer(response.data, 'create', this.domainName);
    }

    async getAll<T>(pagination?: { size: number, skip: number }, options?: RequestOptions): Promise<T[]> {
        try {
            const totalCount = pagination ? pagination.size : await this.query().find(new QueryBuilder().count(true), options);
            return await this.query().find(new QueryBuilder().skip(pagination ? pagination.skip : 0).size(totalCount as number), options);
        } catch (e) {
            throw {message: DatabaseController._getErrorMessage(e)};
        }
    }

    changes(pipeline?: PipelineBuilder, onConnect?: () => void, onDisconnect?: () => void): SocketController {
        const socketController = new SocketController('/__changes__', this.appName, onConnect, onDisconnect);
        const applicationId = BFastConfig.getInstance().getAppCredential(this.appName).applicationId;
        socketController.emit({
            auth: {applicationId: applicationId},
            body: {domain: this.domainName, pipeline: pipeline? pipeline.build(): []}
        });
        return socketController;
    }

    async get<T>(id: string, options?: RequestOptions): Promise<T> {
        return this.query().get(id, options);
    }

    async delete<T>(query: string | QueryBuilder, options?: RequestOptions): Promise<T> {
        const deleteRule = await this.rulesController.deleteRule(this.domainName, query,
            BFastConfig.getInstance().getAppCredential(this.appName), options);
        const response = await this.restAdapter.post(BFastConfig.getInstance().databaseURL(this.appName), deleteRule);
        return DatabaseController._extractResultFromServer(response.data, 'delete', this.domainName);
    }

    query(): QueryController {
        return new QueryController(this.domainName, this.restAdapter, this.rulesController,
            this.appName);
    }

    async update<T>(query: string | QueryBuilder, updateModel: UpdateBuilderController,
                    options?: RequestOptions): Promise<T> {
        const updateRule = await this.rulesController.updateRule(this.domainName, query, updateModel,
            BFastConfig.getInstance().getAppCredential(this.appName), options);
        const response = await this.restAdapter.post(BFastConfig.getInstance().databaseURL(this.appName), updateRule);
        return DatabaseController._extractResultFromServer(response.data, 'update', this.domainName);
    }

    private static _extractResultFromServer(data: any, rule: string, domain: string) {
        if (data && data[`${rule}${domain}`]) {
            return data[`${rule}${domain}`];
        } else {
            if (data && data.errors && data.errors[`${rule}`] && data.errors[`${rule}`][domain]) {
                throw data.errors[`${rule}`][`${domain}`];
            } else {
                throw {message: 'Server general failure', errors: data.errors};
            }
        }
    }

    private static _getErrorMessage(e: any) {
        if (e.message) {
            return e.message;
        } else {
            return (e && e.response && e.response.data) ? e.response.data : e.toString();
        }
    }
}


