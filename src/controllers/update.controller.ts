import { UpdateModel } from "../models/UpdateOperation";
import { BFastConfig } from "../conf";
import { DatabaseController } from "./database.controller";
import { RulesController } from "./rules.controller";
import { QueryModel } from "../models/QueryModel";
import { RequestOptions } from "./query.controller";
import { HttpClientController } from "./http-client.controller";
import { AuthController } from "./auth.controller";

export class UpdateController {
    private updateModel: UpdateModel = {
        $set: {},
        $inc: {},
        $currentDate: {},
        $min: {},
        $max: {},
        $mul: {},
        $rename: {},
        $unset: {}
    };
    private _upsert = false;

    constructor(private readonly domain: string,
        private readonly queryModel: QueryModel,
        private readonly appName: string,
        private readonly httpClientController: HttpClientController,
        private readonly rulesController: RulesController,
        private readonly authController: AuthController) {
    }


    set(field: string, value: any): UpdateController {
        Object.assign(this.updateModel.$set, {
            [field]: value
        });
        return this;
    }

    upsert(value: boolean = false) {
        this._upsert = value;
        return this;
    }

    doc<T extends object>(doc: T): UpdateController {
        Object.assign(this.updateModel.$set, doc);
        return this;
    }

    increment(field: string, amount: number = 1): UpdateController {
        Object.assign(this.updateModel.$inc, {
            [field]: amount
        });
        return this;
    }

    decrement(field: string, amount: number = 1): UpdateController {
        return this.increment(field, -amount);
    }

    currentDate(field: string): UpdateController {
        Object.assign(this.updateModel.$currentDate, {
            [field]: true
        });
        return this;
    }

    minimum(field: string, value: any): UpdateController {
        Object.assign(this.updateModel.$min, {
            [field]: value
        });
        return this;
    }

    maximum(field: string, value: any): UpdateController {
        Object.assign(this.updateModel.$max, {
            [field]: value
        });
        return this;
    }


    multiply(field: string, quantity: number): UpdateController {
        Object.assign(this.updateModel.$mul, {
            [field]: quantity
        });
        return this;
    }

    renameField(field: string, value: string): UpdateController {
        Object.assign(this.updateModel.$rename, {
            [field]: value
        });
        return this;
    }

    removeField(field: string): UpdateController {
        Object.assign(this.updateModel.$unset, {
            [field]: ''
        });
        return this;
    }

    private build(): UpdateModel {
        return this.updateModel;
    }

    async update(options?: RequestOptions): Promise<any> {
        const credential = BFastConfig.getInstance().credential(this.appName);
        // delete this.updateModel.upsert;
        Object.keys(this.updateModel).forEach(key => {
            try {
                // @ts-ignore
                if (typeof this.updateModel[key] === "object" && Object.keys(this.updateModel[key]).length === 0) {
                    // @ts-ignore
                    delete this.updateModel[key];
                }
            } catch (__23) {
                console.log(__23);
            }
        });
        const updateRule = await this.rulesController.updateRule(
            this.domain,
            this.queryModel,
            this.build(),
            this._upsert,
            credential,
            options
        );
        const response = await this.httpClientController.post(
            BFastConfig.getInstance().databaseURL(this.appName),
            updateRule,
            {},
            {
                context: this.domain,
                rule: `update${this.domain}`,
                type: 'daas',
                token: await this.authController.getToken()
            }
        );
        return DatabaseController._extractResultFromServer(response.data, 'update', this.domain);
    }
}
