export class SecurityController {
    constructor(private readonly secret: string) {
    }

    async encrypt(data: { [key: string]: any }): Promise<string> {
        if (!data) {
            return data;
        }
        return JSON.stringify(data).split('').reverse().join('')
    }

    async decrypt(data: string): Promise<{ [key: string]: any } | null> {
        try{
            if (!data) {
                return null;
            }
            return JSON.parse(data.split('').reverse().join(''));
        }catch (e){
            return null;
        }
    }
}
