import {QueryController} from "../controllers/QueryController";
import {CacheOptions} from "./CacheAdapter";

export interface DomainI<T extends DomainModel> {
    domainName: string;

    save<T>(model: T, options?: CacheOptions): Promise<T>;

    getAll<T>(pagination?:{size:number,skip:number}, options?: CacheOptions): Promise<T[]>;

    get<T>(objectId: string, options?: CacheOptions): Promise<T>;

    query<T>(options?: CacheOptions): QueryController<T>;

    update<T>(objectId: string, model: T, options?: CacheOptions): Promise<T>;

    delete<T>(objectId: string, options?: CacheOptions): Promise<T>;
}

export interface DomainModel {
    [name: string]: any
}