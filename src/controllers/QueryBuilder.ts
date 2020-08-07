import {QueryModel} from "../model/QueryModel";

export class QueryBuilderController {
    private query: QueryModel<any> = {
        filter: {},
        return: []
    }

    equalTo(field: string, value: any): QueryBuilderController {
        Object.assign(this.query.filter, {
            [field]: {
                $eq: value
            }
        });
        return this;
    }

    notEqualTo(field: string, value: any): QueryBuilderController {
        Object.assign(this.query.filter, {
            [field]: {
                $ne: value
            }
        });
        return this;
    }

    greaterThan(field: string, value: any): QueryBuilderController {
        Object.assign(this.query.filter, {
            [field]: {
                $gt: value
            }
        });
        return this;
    }

    greaterThanOrEqual(field: string, value: any): QueryBuilderController {
        Object.assign(this.query.filter, {
            [field]: {
                $gte: value
            }
        });
        return this;
    }

    includesIn(field: string, value: any[]): QueryBuilderController {
        Object.assign(this.query.filter, {
            [field]: {
                $in: value
            }
        });
        return this;
    }

    notIncludesIn(field: string, value: any[]): QueryBuilderController {
        Object.assign(this.query.filter, {
            [field]: {
                $nin: value
            }
        });
        return this;
    }

    lessThan(field: string, value: any[]): QueryBuilderController {
        Object.assign(this.query.filter, {
            [field]: {
                $lt: value
            }
        });
        return this;
    }

    lessThanOrEqual(field: string, value: any[]): QueryBuilderController {
        Object.assign(this.query.filter, {
            [field]: {
                $lte: value
            }
        });
        return this;
    }

    build(): QueryModel<any> {
        return this.query;
    }
}
