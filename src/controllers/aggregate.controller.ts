import {AuthController} from "./auth.controller";
import {HttpClientController} from "./http-client.controller";
import {RequestOptions} from "./query.controller";
import {RulesController} from "./rules.controller";
import {AggregateModel} from "../models/aggregate.model";
import {getConfig} from '../bfast';

export class AggregateController {
    private aggregateModel: AggregateModel = {
        hashes: [],
        pipelines: []
    }

    constructor(private readonly domain: string,
                private readonly httpClientController: HttpClientController,
                private readonly rulesController: RulesController,
                private readonly authController: AuthController,
                private readonly appName: string) {
    }

    hashes(localDataHashes: string[]): AggregateController {
        Object.assign(this.aggregateModel, {
            hashes: localDataHashes
        });
        return this;
    }

    stage(stage: any): AggregateController {
        const _set = new Set(this.aggregateModel.pipelines);
        _set.add(stage);
        Object.assign(this.aggregateModel, {
            pipelines: Array.from(_set)
        });
        return this;
    }

    async find(options?: RequestOptions) {
        const aggregateRule = await this.rulesController.aggregateRule(
            this.domain,
            this.aggregateModel,
            getConfig().credential(this.appName),
            options
        );
        return this.aggregateRuleRequest(aggregateRule);
    }

    private async aggregateRuleRequest(pipelineRule: any): Promise<any> {
        const response = await this.httpClientController.post(
            getConfig().databaseURL(this.appName),
            pipelineRule,
            {},
            {
                context: this.domain,
                rule: `aggregate${this.domain}`,
                type: 'daas',
                token: await this.authController.getToken()
            }
        );
        const data = response.data;
        if (data && data[`aggregate${this.domain}`]) {
            return data[`aggregate${this.domain}`];
        } else {
            const errors = data.errors;
            let aggregateError: any = {message: "Aggregation not succeed"};
            Object.keys(errors).forEach(value => {
                if (value.includes('aggregate')) {
                    aggregateError = errors[value];
                }
            });
            aggregateError['errors'] = errors;
            throw aggregateError;
        }
    }
}
