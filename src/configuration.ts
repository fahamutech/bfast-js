export class Config {
    static cloudDatabaseUrl?: string;
    static cloudFunctionsUrl?: string;
    static applicationId: string;
    static projectId: string;
    static token?: string;
    /**
     * @deprecated, use #token instead will be remove in next minor release
     */
    static apiKey?: string;

    /**
     * @deprecated will be removed in next minor release
     * @param data
     */
    parseApiUrl(data: { [key: string]: any }): { [key: string]: any } {
        if (data) {
            let stringData = JSON.stringify(data);
            stringData = stringData.replace(new RegExp('http://ide:3000', 'g'), `${Config.cloudDatabaseUrl}/ide/api`);
            const pardesData = JSON.parse(stringData);
            console.log(data);
            console.log(Object.keys(pardesData));
            Object.keys(pardesData).forEach(element => {
                console.log(pardesData[element]);
            });
            return pardesData;
        } else {
            return undefined;
        }
    }

    getHeaders(): { [key: string]: any } {
        return {
            'Content-Type': 'application/json',
            'X-Parse-Application-Id': Config.applicationId
        }
    }

    /**
     * @deprecated use #getCloudFunctionsUrl instead
     */
    getFaasApi() {
        return `${Config.cloudDatabaseUrl}/ide/faas`;
    }

    getCloudFunctionsUrl() {
        if (Config.cloudFunctionsUrl && Config.cloudFunctionsUrl.startsWith('http')) {
            return Config.cloudFunctionsUrl;
        }
        return `https://${Config.projectId}-faas.bfast.fahamutech.com`
    }

    /**
     * @deprecated use #getCloudDatabaseUrl
     * @param domain
     */
    getApiUrl(domain: string): string {
        return `${Config.cloudDatabaseUrl}/ide/api/${domain}`
    }

    getCloudDatabaseUrl() {
        if (Config.cloudDatabaseUrl && Config.cloudDatabaseUrl.startsWith('http')) {
            return Config.cloudDatabaseUrl;
        }
        return `https://${Config.projectId}-daas.bfast.fahamutech.com`;
    }

    /**
     * @deprecated use #Query object to search
     * @param domain
     * @param queryName
     */
    getSearchApi(domain: string, queryName: string): string {
        return `${this.getApiUrl(domain)}/search/${queryName}`
    }

    /**
     * @deprecated use #getCloudFunctionsUrl
     * @param name
     */
    getFunctionApi(name: string): string {
        return `${Config.cloudDatabaseUrl}/ide/function/${name}`;
    }
}
