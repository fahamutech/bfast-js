import {QueryModel} from "../model/QueryModel";


export enum QueryOrder {
    ASCENDING = 1,
    DESCENDING = -1
}

export class QueryBuilder {
    private query: QueryModel<any> = {
        filter: {},
        return: [],
        skip: 0,
        size: 100,
        orderBy: [{'createdAt': -1}],
        count: false,
    }

    byId(id: string): QueryBuilder {
        this.query.id = id;
        return this;
    }

    count(countQuery = false): QueryBuilder {
        this.query.count = countQuery;
        return this;
    }

    size(size: number): QueryBuilder {
        this.query.size = size;
        return this;
    }

    skip(skip: number): QueryBuilder {
        this.query.skip = skip;
        return this;
    }

    orderBy(field: string, order: QueryOrder): QueryBuilder {
        const orderBySet = new Set(this.query.orderBy).add({
            [field]: order
        });
        this.query.orderBy = Array.from(orderBySet);
        return this;
    }

    equalTo(field: string, value: any): QueryBuilder {
        Object.assign(this.query.filter, {
            [field]: {
                $eq: value
            }
        });
        return this;
    }

    notEqualTo(field: string, value: any): QueryBuilder {
        Object.assign(this.query.filter, {
            [field]: {
                $ne: value
            }
        });
        return this;
    }

    greaterThan(field: string, value: any): QueryBuilder {
        Object.assign(this.query.filter, {
            [field]: {
                $gt: value
            }
        });
        return this;
    }

    greaterThanOrEqual(field: string, value: any): QueryBuilder {
        Object.assign(this.query.filter, {
            [field]: {
                $gte: value
            }
        });
        return this;
    }

    includesIn(field: string, value: any[]): QueryBuilder {
        Object.assign(this.query.filter, {
            [field]: {
                $in: value
            }
        });
        return this;
    }

    notIncludesIn(field: string, value: any[]): QueryBuilder {
        Object.assign(this.query.filter, {
            [field]: {
                $nin: value
            }
        });
        return this;
    }

    lessThan(field: string, value: any[]): QueryBuilder {
        Object.assign(this.query.filter, {
            [field]: {
                $lt: value
            }
        });
        return this;
    }

    lessThanOrEqual(field: string, value: any[]): QueryBuilder {
        Object.assign(this.query.filter, {
            [field]: {
                $lte: value
            }
        });
        return this;
    }

    exists(field: string, value = true): QueryBuilder {
        Object.assign(this.query.filter, {
            [field]: {
                $exists: value
            }
        });
        return this;
    }

    searchByRegex(field: string, regex: string): QueryBuilder {
        Object.assign(this.query.filter, {
            [field]: {
                $regex: regex
            }
        });
        return this;
    }

    fullTextSearch(field: string, text: {
        search: string,
        language?: string,
        caseSensitive?: boolean,
        diacriticSensitive?: boolean
    }): QueryBuilder {
        Object.assign(this.query.filter, {
            $text: {
                $search: text.search,
                $language: text.language,
                $caseSensitive: text.caseSensitive,
                $diacriticSensitive: text.diacriticSensitive
            }
        });
        return this;
    }

    customQuery(query: Object): QueryBuilder {
        Object.assign(this.query.filter, query);
        return this;
    }

    build(): QueryModel<any> {
        return this.query;
    }
}
