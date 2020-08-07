import {QueryController} from "../controllers/QueryController";
import {RequestOptions} from "./QueryAdapter";
import {RulesModel} from "../model/RulesModel";
import {UpdateBuilderController} from "../controllers/UpdateBuilderController";

export interface DomainI<T extends DomainModel> {

    save<T extends { return: string[] }>(model: T, options?: RequestOptions): Promise<T>;

    getAll<T>(pagination?: { size: number, skip: number }, options?: RequestOptions): Promise<T[]>;

    get<T>(objectId: string, options?: RequestOptions): Promise<T>;

    query<T>(options?: RequestOptions): QueryController<T>;

    update<T>(objectId: string, model: UpdateBuilderController, options?: RequestOptions): Promise<T>;

    delete<T>(objectId: string, options?: RequestOptions): Promise<T>;

    daasRules(rules: RulesModel): Promise<any>;
}

export interface DomainModel {
    [name: string]: any
}

interface Pointer {
    __type: string;
    className: string;
    objectId: string;
}
