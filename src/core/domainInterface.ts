import {Query} from 'parse';

export interface DomainI {
    domainName: string;

    save(model: DomainModel): Promise<DomainModel>;

    getAll(): Promise<DomainModel[]>;

    get(objectId: string): Promise<DomainModel>;

    query(): Query;

    update(objectId: string, model: DomainModel): Promise<DomainModel>;

    delete(objectId: string): Promise<any>;
}

export interface DomainModel {
    [name: string]: any
}
