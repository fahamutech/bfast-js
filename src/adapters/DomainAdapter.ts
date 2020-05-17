import {QueryController} from "../controllers/QueryController";
import {RequestOptions} from "./QueryAdapter";

export interface DomainI<T extends DomainModel> {

    save<T>(model: T, options?: RequestOptions): Promise<T>;

    getAll<T>(pagination?: { size: number, skip: number }, options?: RequestOptions): Promise<T[]>;

    get<T>(objectId: string, options?: RequestOptions): Promise<T>;

    query<T>(options?: RequestOptions): QueryController<T>;

    update<T>(objectId: string, model: T, options?: RequestOptions): Promise<T>;

    delete<T>(objectId: string, options?: RequestOptions): Promise<T>;
}

export interface DomainModel {
    [name: string]: any
}

interface Pointer {
    __type: string;
    className: string;
    objectId: string;
}
