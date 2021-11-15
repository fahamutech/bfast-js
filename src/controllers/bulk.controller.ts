import {TransactionModel} from "../models/TransactionModel";
import {RulesController} from "./rules.controller";
import {QueryModel} from "../models/QueryModel";
import {UpdateModel} from "../models/UpdateOperation";
import {HttpClientController} from "./http-client.controller";
import {AuthController} from "./auth.controller";
import {getConfig} from '../bfast';

export class BulkController {

    private transactionRequests: TransactionModel[];

    constructor(private readonly appName: string,
        private readonly httpClientController: HttpClientController,
        private readonly rulesController: RulesController,
        private readonly authController: AuthController) {
        this.transactionRequests = [];
    }

    async commit(options?: {
        before?: (transactionRequests: TransactionModel[]) => Promise<TransactionModel[]>,
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
        const credential = getConfig().credential(this.appName);
        const transactionRule = await this.rulesController.bulk(this.transactionRequests,
            credential, { useMasterKey: options?.useMasterKey });
        const response = await this.httpClientController.post(
            getConfig().databaseURL(this.appName),
            transactionRule,
            {
                headers: {
                    'x-parse-application-id': credential.applicationId
                }
            },
            {
                context: 'bulk',
                rule: 'bulk',
                type: 'daas',
                token: await this.authController.getToken()
            });
        this.transactionRequests.splice(0);
        if (options && options.after) {
            options.after().catch(_ => {
            });
        }
        return BulkController._extractResultFromServer(response.data);
    }

    create(domain: string, data: any | any[]): BulkController {
        this.transactionRequests.push({
            data,
            action: "create",
            domain
        });
        return this;
    }

    delete(domain: string, payload: { query: QueryModel }): BulkController {
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
    ): BulkController {
        this.transactionRequests.push({
            domain,
            action: "update",
            data: payload as any
        });
        return this;
    }

    static _extractResultFromServer(data: any) {
        if (data && data.hasOwnProperty('transaction')) {
            delete data['transaction'].commit?.errors;
            return data.transaction.commit;
        } else {
            if (data && data.errors && data.errors.hasOwnProperty('transaction')) {
                throw data.errors['transaction'];
            } else {
                throw { message: 'Fail to process a result', errors: data.errors };
            }
        }
    }

}
