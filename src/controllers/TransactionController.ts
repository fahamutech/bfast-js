import {TransactionModel} from "../models/TransactionModel";
import {BFastConfig} from "../conf";
import {HttpClientAdapter} from "../adapters/HttpClientAdapter";
import {RulesController} from "./RulesController";
import {QueryModel} from "../models/QueryModel";
import {UpdateModel} from "../models/UpdateOperation";

export class TransactionController {

    private transactionRequests: TransactionModel[];

    constructor(private readonly appName: string,
                private readonly restApi: HttpClientAdapter,
                private readonly rulesController: RulesController) {
        this.transactionRequests = [];
    }

    async commit(options?: {
        before: (transactionRequests: TransactionModel[]) => Promise<TransactionModel[]>,
        after?: () => Promise<void>,
        useMasterKey?: boolean
    }): Promise<any> {
        if (options && options.before) {
            const result = await options.before(this.transactionRequests);
            if (result && Array.isArray(result) && result.length > 0) {
                this.transactionRequests = result;
            } else if (result && Array.isArray(result) && result.length === 0) {
                this.transactionRequests = result;
            }
        }
        const credential = BFastConfig.getInstance().credential(this.appName);
        const transactionRule = await this.rulesController.transaction(this.transactionRequests,
            credential, {useMasterKey: options?.useMasterKey});
        const response = await this.restApi.post(BFastConfig.getInstance().databaseURL(this.appName), transactionRule, {
            headers: {
                'x-parse-application-id': credential.applicationId
            }
        });
        this.transactionRequests.splice(0);
        if (options && options.after) {
            await options.after();
        }
        return response.data;
    }

    create(domain: string, data: any | any[]): TransactionController {
        this.transactionRequests.push({
            data,
            action: "create",
            domain
        });
        return this;
    }

    delete(domain: string, payload: { query: QueryModel }): TransactionController {
        this.transactionRequests.push({
            domain,
            action: "delete",
            data: payload as any
        });
        return this;
    }

    update(
        domain: string,
        payload:
            { query: QueryModel, update: UpdateModel }
            | { query: QueryModel, update: UpdateModel }[]
    ): TransactionController {
        this.transactionRequests.push({
            domain,
            action: "update",
            data: payload as any
        });
        return this;
    }

}
