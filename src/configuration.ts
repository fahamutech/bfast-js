export class Config{
    static serverUrl: string;
    static apiKey: string;
    parseApiUrl(data: {[key: string]: any}): {[key: string]: any}{
        if(data) {
            let stringData = JSON.stringify(data);
            stringData = stringData.replace(new RegExp('http://ide:3000', 'g'), `${Config.serverUrl}/ide/api`);
            return JSON.parse(stringData);
        }else{
            return undefined;
        }
    }
    getHeaders(): {[key: string]: any}{
        return {
            'Content-Type': 'application/json',
            'X-Api-Key': Config.apiKey
        }
    }

    getFaasApi(){
        return `${Config.serverUrl}/ide/faas`;
    }

    getApiUrl(domain: string): string{
        return `${Config.serverUrl}/ide/api/${domain}`
    }

    getSearchApi(domain: string, queryName: string): string{
        return `${this.getApiUrl(domain)}/search/${queryName}`
    }

    getFunctionApi(name: string): string{
        return `${Config.serverUrl}/ide/function/${name}`;
    }
}
