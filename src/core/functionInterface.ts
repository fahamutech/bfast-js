export interface FunctionI{
    run(body? : {[key: string]: any}): Promise<any>;
    names(): Promise<any>;
}
