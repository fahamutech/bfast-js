/**
 * need to be implement to secure local stored data in index db
 */

export class SecurityController {
    constructor(private readonly secret: string) {
    }

    async encrypt(data: { [key: string]: any }): Promise<any> {
        // if (!data) {
        //     return data;
        // }
        // return JSON.stringify(data).split('').reverse().join('')
        return data;
    }

    async decrypt(data: any): Promise<any> {
        // try{
        //     if (!data) {
        //         return null;
        //     }
        //     return JSON.parse(data.split('').reverse().join(''));
        // }catch (e){
        //     return null;
        // }
        return data
    }
}
