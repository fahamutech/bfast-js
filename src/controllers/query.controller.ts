import {BFastConfig} from "../conf";
import {RulesController} from "./rules.controller";
import {SocketController} from "./socket.controller";
import {QueryModel} from "../models/QueryModel";
import {UpdateController} from "./update.controller";
import {HttpClientController} from "./http-client.controller";
import {AuthController} from "./auth.controller";
import {DatabaseChangesController} from "./database-changes.controller";
import {extractResultFromServer} from "../utils/data.util";

export enum QueryOrder {
    ASCENDING = 'asc',
    DESCENDING = 'desc'
}

export class QueryController {
    private query: QueryModel = {
        id: undefined,
        filter: {},
        return: [],
        skip: 0,
        hashes: [],
        cids: false,
        orderBy: [{'createdAt': -1}],
        count: false,
    }

    constructor(private readonly domain: string,
                private readonly httpClientController: HttpClientController,
                private readonly rulesController: RulesController,
                private readonly authController: AuthController,
                private readonly appName: string) {
    }

    orderBy(field: string, value: 'asc' | 'desc' = 'asc'): QueryController {
        let _value = 1;
        if (value === "asc") {
            _value = 1;
        }
        if (value === "desc") {
            _value = -1;
        }
        // if (this?.query?.filter[field]?.$fn) {
        //     Object.assign(this.query.filter[field], {
        //         $orderBy: value
        //     });
        // } else {
        //     Object.assign(this.query.filter, {
        //         [field]: {
        //             $fn: 'return true',
        //             $orderBy: value
        //         }
        //     });
        // }
        // if (typeof options?.limit === "number"){
        //     Object.assign(this.query.filter[field], {
        //         $limit: options.limit
        //     });
        // }
        // if (typeof options?.skip === "number"){
        //     Object.assign(this.query.filter[field], {
        //         $skip: options.skip
        //     });
        // }
        // return this.find(options);
        this.query.orderBy?.push({[field]: _value});
        return this;
    }

    cids(value: boolean) {
        this.query.cids = value;
        return this;
    }

    byId(id: string): QueryController {
        this.query.id = id;
        return this;
    }

    count(countQuery = false): QueryController {
        this.query.count = countQuery;
        return this;
    }

    size(size: number): QueryController {
        this.query.size = size;
        return this;
    }

    skip(skip: number): QueryController {
        this.query.skip = skip;
        return this;
    }

    equalTo(field: string, value: any): QueryController {
        if (!this.query.filter.hasOwnProperty(field)) {
            this.query.filter[field] = {};
        }
        Object.assign(this.query.filter[field], {
            $eq: value
        });
        return this;
    }

    hashes(localDataHashes: string[]): QueryController {
        Object.assign(this.query, {
            hashes: localDataHashes
        });
        return this;
    }

    notEqualTo(field: string, value: any): QueryController {
        if (!this.query.filter.hasOwnProperty(field)) {
            this.query.filter[field] = {};
        }
        Object.assign(this.query.filter[field], {
            $ne: value
        });
        return this;
    }

    greaterThan(field: string, value: any): QueryController {
        if (!this.query.filter.hasOwnProperty(field)) {
            this.query.filter[field] = {};
        }
        Object.assign(this.query.filter[field], {
            $gt: value
        });
        return this;
    }

    greaterThanOrEqual(field: string, value: any): QueryController {
        if (!this.query.filter.hasOwnProperty(field)) {
            this.query.filter[field] = {};
        }
        Object.assign(this.query.filter[field], {
            $gte: value
        });
        return this;
    }

    includesIn(field: string, value: any[]): QueryController {
        if (!this.query.filter.hasOwnProperty(field)) {
            this.query.filter[field] = {};
        }
        Object.assign(this.query.filter[field], {
            $in: value
        });
        return this;
    }

    notIncludesIn(field: string, value: any[]): QueryController {
        if (!this.query.filter.hasOwnProperty(field)) {
            this.query.filter[field] = {};
        }
        Object.assign(this.query.filter[field], {
            $nin: value
        });
        return this;
    }

    lessThan(field: string, value: any): QueryController {
        if (!this.query.filter.hasOwnProperty(field)) {
            this.query.filter[field] = {};
        }
        Object.assign(this.query.filter[field], {
            $lt: value
        });
        return this;
    }

    lessThanOrEqual(field: string, value: any): QueryController {
        if (!this.query.filter.hasOwnProperty(field)) {
            this.query.filter[field] = {};
        }
        Object.assign(this.query.filter[field], {
            $lte: value
        });
        return this;
    }

    exists(field: string): QueryController {
        if (!this.query.filter.hasOwnProperty(field)) {
            this.query.filter[field] = {};
        }
        Object.assign(this.query.filter[field], {
            $exists: true
        });
        return this;
    }

    searchByRegex(field: string, regex: string, flags = 'ig'): QueryController {
        if (!this.query.filter.hasOwnProperty(field)) {
            this.query.filter[field] = {};
        }
        Object.assign(this.query.filter[field], {
            $regex: regex,
            $options: flags
        });
        return this;
    }

    // fullTextSearch(field: string, text: string, flags = 'ig'): QueryController {
    //     Object.assign(this.query.filter, {
    //         [field]: {
    //             $fn: `return it?.toString()?.match(new RegExp(${text}, ${flags})) !== null;`
    //         }
    //     });
    //     return this;
    // }

    async raw(query: any, options?: RequestOptions): Promise<any[]> {
        this.query.filter = query;
        return this.find(options);
    }

    private buildQuery(): QueryModel {
        return this.query;
    }

    async delete<T>(options?: RequestOptions): Promise<T> {
        const credential = BFastConfig.getInstance().credential(this.appName);
        const deleteRule = await this.rulesController.deleteRule(this.domain, this.buildQuery(), credential, options);
        const response = await this.httpClientController.post(
            BFastConfig.getInstance().databaseURL(this.appName),
            deleteRule,
            {
                headers: {}
            },
            {
                context: this.domain,
                rule: `delete${this.domain}`,
                type: 'daas',
                token: await this.authController.getToken()
            });
        return extractResultFromServer(response.data, 'delete', this.domain);
    }

    updateBuilder(): UpdateController {
        return new UpdateController(
            this.domain,
            this.buildQuery(),
            this.appName,
            this.httpClientController,
            this.rulesController,
            this.authController
        );
    }

    changes(
        onConnect?: () => void,
        onDisconnect?: () => void,
        options: RequestOptions = {useMasterKey: false}
    ): DatabaseChangesController {
        const applicationId = BFastConfig.getInstance().credential(this.appName).applicationId;
        const projectId = BFastConfig.getInstance().credential(this.appName).projectId;
        const masterKey = BFastConfig.getInstance().credential(this.appName).appPassword;
        let match: any;
        if (this.buildQuery() && typeof this.buildQuery().filter === "object") {
            match = this.buildQuery().filter as object;
            Object.keys(match).forEach(key => {
                match[`fullDocument.${key}`] = match[key];
                delete match[key];
            });
        }
        const socketController = new SocketController('/v2/__changes__', this.appName, () => {
            if (onConnect && typeof onConnect === "function") {
                onConnect();
            }
            socketController.emit({
                auth: {
                    applicationId: applicationId,
                    topic: `${projectId}_${this.domain}`,
                    masterKey: options.useMasterKey === true ? masterKey : null
                },
                body: {
                    domain: this.domain, pipeline: []
                }
            });
        }, onDisconnect);
        return new DatabaseChangesController(socketController);
    }

    async find<T>(options?: RequestOptions): Promise<T> {
        const queryRule = await this.rulesController.queryRule(this.domain, this.buildQuery(),
            BFastConfig.getInstance().credential(this.appName), options);
        return this.queryRuleRequest(queryRule);
    }

    async queryRuleRequest(queryRule: any): Promise<any> {
        const response = await this.httpClientController.post(
            BFastConfig.getInstance().databaseURL(this.appName),
            queryRule,
            {},
            {
                context: this.domain,
                rule: `query${this.domain}`,
                type: 'daas',
                token: await this.authController.getToken()
            }
        );
        const data = response.data;
        if (data && data[`query${this.domain}`] !== undefined) {
            return data[`query${this.domain}`];
        } else {
            const errors = data.errors;
            let queryError: any = {message: "Query not succeed"};
            Object.keys(errors && typeof errors === "object" ? errors : {}).forEach(value => {
                if (value.includes('query')) {
                    queryError = errors[value];
                }
            });
            queryError['errors'] = errors;
            throw queryError;
        }
    }

    private static parseFnValue(value: any) {
        let parsed = ''
        switch (typeof value) {
            case "string":
                parsed = `'${value}'`;
                break;
            case "number":
                parsed = `${value}`;
                break;
            case "object":
                parsed = `JSON.parse('${JSON.stringify(value)}')`
                break;
            default:
                return parsed;
        }
        return parsed;
    }

}

export interface RequestOptions extends CacheOptions {
    useMasterKey?: boolean,
    returnFields?: string[],
    // this is useful when perform orderBy operation
    skip?: number,
    limit?: number
}

export interface FileOptions extends RequestOptions {
    pn?: boolean;
    filename?: string
}

interface CacheOptions {
    /**
     * enable cache in method level, override global option
     */
    cacheEnable?: boolean;
    /**
     * cache to expire flag
     */
    dtl?: number;

    /**
     * callback to response from network data, just before that data is updated to cache
     * @param identifier {string} cache identifier
     * @param data {T extend object} fresh data from network
     // * @deprecated use #onUpdated
     */
    freshDataCallback?: <T>(value: { identifier: string, data: T }) => void;
}
