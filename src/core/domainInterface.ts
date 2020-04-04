export interface DomainI {
    domainName: string;

    save(model: DomainModel): Promise<Parse.Object>;

    getAll(): Promise<Parse.Object[]>;

    get(objectId: string): Promise<Parse.Object>;

    query(): Parse.Query;

    update(objectId: string, model: DomainModel): Promise<Parse.Object>;

    delete(objectId: string): Promise<any>;
}

export interface DomainModel {
    [name: string]: any
}
