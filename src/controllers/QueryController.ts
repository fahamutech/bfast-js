import {Query} from 'parse'

export class QueryController extends Query {

    private collectionName: string;

    constructor(collectionName: string) {
        super(collectionName);
        this.collectionName = collectionName;
    }

    // async distinct(key: any): Promise<any> {
    //     try {
    //         const response = super.distinct(key);
    //         return JSON.parse(JSON.stringify(response));
    //     } catch (e) {
    //         throw e;
    //     }
    // }

    async find(options?: Query.FindOptions): Promise<any[]> {
        try {
            const response = await super.find(options);
            return JSON.parse(JSON.stringify(response));
        } catch (e) {
            throw e;
        }
    }

}
