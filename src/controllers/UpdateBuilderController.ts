import {UpdateModel} from "../model/UpdateOperation";

export class UpdateBuilderController {
    private query: UpdateModel = {$set: {}};

    set(field: string, value: any): UpdateBuilderController {
        Object.assign(this.query.$set, {
            [field]: value
        });
        return this;
    }

    increment(field: string, amount: number = 1): UpdateBuilderController {
        Object.assign(this.query.$inc, {
            [field]: amount
        });
        return this;
    }

    decrement(field: string, amount: number = 1): UpdateBuilderController {
        return this.increment(field, -amount);
    }

    currentDate(field: string): UpdateBuilderController {
        Object.assign(this.query.$currentDate, {
            [field]: true
        });
        return this;
    }

    minimum(field: string, value: any): UpdateBuilderController {
        Object.assign(this.query.$min, {
            [field]: value
        });
        return this;
    }

    maximum(field: string, value: any): UpdateBuilderController {
        Object.assign(this.query.$max, {
            [field]: value
        });
        return this;
    }


    multiply(field: string, quantity: number): UpdateBuilderController {
        Object.assign(this.query.$mul, {
            [field]: quantity
        });
        return this;
    }

    renameField(field: string, value: string): UpdateBuilderController {
        Object.assign(this.query.$rename, {
            [field]: value
        });
        return this;
    }

    removeField(field: string): UpdateBuilderController {
        Object.assign(this.query.$unset, {
            [field]: ''
        });
        return this;
    }

    build(): UpdateModel {
        return this.query;
    }
}
