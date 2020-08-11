import {QueryController} from "./QueryController";
import {BFastConfig} from "../conf";
import {HttpClientAdapter} from "../adapters/HttpClientAdapter";
import {RequestOptions} from "../adapters/QueryAdapter";
import {AuthAdapter} from "../adapters/AuthAdapter";
import {RulesController} from "./RulesController";
import {SocketController} from "./SocketController";
import {DatabaseChangesModel} from "../model/DatabaseChangesModel";

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
            const totalCount = pagination ? pagination.size : await this.query().count(true).find(options);
            return await this.query().skip(pagination ? pagination.skip : 0).size(totalCount as number).find(options);
        } catch (e) {
            throw {message: DatabaseController._getErrorMessage(e)};
        }
    }

    async get<T>(id: string, options?: RequestOptions): Promise<T> {
        return this.query().byId(id).find<T>(options);
    }

    query(): QueryController {
        return new QueryController(this.domainName, this.restAdapter, this.rulesController,
            this.appName);
    }

    static _extractResultFromServer(data: any, rule: string, domain: string) {
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

    static _getErrorMessage(e: any) {
        if (e.message) {
            return e.message;
        } else {
            return (e && e.response && e.response.data) ? e.response.data : e.toString();
        }
    }
}

export class DatabaseChangesController {
    constructor(private socketController: SocketController) {
    }

    addListener(handler: (response: { body: DatabaseChangesModel }) => any) {
        this.socketController.listener(handler);
    }

    close() {
        this.socketController.close()
    }

    open() {
        this.socketController.open()
    }
}
