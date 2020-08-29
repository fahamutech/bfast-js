import {UpdateModel} from "../models/UpdateOperation";
import {BFastConfig} from "../conf";
import {DatabaseController} from "./DatabaseController";
import {RulesController} from "./RulesController";
import {QueryModel} from "../models/QueryModel";
import {HttpClientAdapter} from "../adapters/HttpClientAdapter";
import {RequestOptions} from "./QueryController";

export class UpdateController {
    private query: UpdateModel = {$set: {}};

    constructor(private readonly domain: string,
                private readonly queryModel: QueryModel,
                private readonly appName: string,
                private readonly restAdapter: HttpClientAdapter,
                private readonly rulesController: RulesController) {
    }


    set(field: string, value: any): UpdateController {
        Object.assign(this.query.$set, {
            [field]: value
        });
        return this;
    }

    doc<T extends object>(doc: T): UpdateController {
        Object.assign(this.query.$set, doc);
        return this;
    }

    increment(field: string, amount: number = 1): UpdateController {
        Object.assign(this.query.$inc, {
            [field]: amount
        });
        return this;
    }

    decrement(field: string, amount: number = 1): UpdateController {
        return this.increment(field, -amount);
    }

    currentDate(field: string): UpdateController {
        Object.assign(this.query.$currentDate, {
            [field]: true
        });
        return this;
    }

    minimum(field: string, value: any): UpdateController {
        Object.assign(this.query.$min, {
            [field]: value
        });
        return this;
    }

    maximum(field: string, value: any): UpdateController {
        Object.assign(this.query.$max, {
            [field]: value
        });
        return this;
    }


    multiply(field: string, quantity: number): UpdateController {
        Object.assign(this.query.$mul, {
            [field]: quantity
        });
        return this;
    }

    renameField(field: string, value: string): UpdateController {
        Object.assign(this.query.$rename, {
            [field]: value
        });
        return this;
    }

    removeField(field: string): UpdateController {
        Object.assign(this.query.$unset, {
            [field]: ''
        });
        return this;
    }

    private build(): UpdateModel {
        return this.query;
    }

    async update(options?: RequestOptions): Promise<any> {
        const updateRule = await this.rulesController.updateRule(this.domain, this.queryModel, this.build(),
            BFastConfig.getInstance().credential(this.appName), options);
        const response = await this.restAdapter.post(BFastConfig.getInstance().databaseURL(this.appName), updateRule);
        return DatabaseController._extractResultFromServer(response.data, 'update', this.domain);
    }
}
