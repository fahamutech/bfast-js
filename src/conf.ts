export class BFastConfig {
    applicationId: any;
    cloudFunctionsUrl: any;
    projectId: any;
    cloudDatabaseUrl: any;
    token: any;
    appPassword: any;
    cache = true;

    private constructor() {
    }

    private static instance: BFastConfig;

    static getInstance(): BFastConfig {
        if (!BFastConfig.instance) {
            BFastConfig.instance = new BFastConfig();
        }

        return BFastConfig.instance;
    }

    getHeaders(): { [key: string]: any } {
        return {
            'Content-Type': 'application/json',
            'X-Parse-Application-Id': this.applicationId
        }
    };

    getCloudFunctionsUrl(path: string) {
        if (path.startsWith('http')) {
            return path;
        }
        if (this.cloudFunctionsUrl && this.cloudFunctionsUrl.startsWith('http')) {
            return this.cloudFunctionsUrl;
        }
        return `https://${this.projectId}-faas.bfast.fahamutech.com${path}`
    };

    getCloudDatabaseUrl() {
        if (this.cloudDatabaseUrl && this.cloudDatabaseUrl.startsWith('http')) {
            return this.cloudDatabaseUrl;
        }
        return `https://${this.projectId}-daas.bfast.fahamutech.com`;
    };
}
