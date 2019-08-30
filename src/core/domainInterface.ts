export interface DomainI{
    set(name: string, value: any): DomainModel;
    setValues(model: DomainModel): DomainModel;
    save(): Promise<any>;
    many(options?: {[name: string]: any}): Promise<any>;
    one(options: {link: string, id: string}): Promise<any>;
    navigate(link: string): Promise<any>;
}

export interface DomainModel{
    [name: string] : any
}
