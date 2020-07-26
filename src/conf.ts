export class BFastConfig {
    static DEFAULT_APP = 'DEFAULT';
    private _DEFAULT_DOMAINS_CACHE_DB_NAME = '__domain';
    get DEFAULT_DOMAINS_CACHE_DB_NAME() {
        return this._DEFAULT_DOMAINS_CACHE_DB_NAME;
    }

    private _DEFAULT_AUTH_CACHE_DB_NAME = '__auth';
    get DEFAULT_AUTH_CACHE_DB_NAME() {
        return this._DEFAULT_AUTH_CACHE_DB_NAME;
    }

    private _DEFAULT_CACHE_DB_NAME = '__cache';
    get DEFAULT_CACHE_DB_NAME() {
        return this._DEFAULT_CACHE_DB_NAME;
    }

    private _DEFAULT_CACHE_TTL_COLLECTION_NAME = '__cache_ttl';
    get DEFAULT_CACHE_TTL_COLLECTION_NAME() {
        return this._DEFAULT_CACHE_TTL_COLLECTION_NAME;
    }

    private credentials: { [key: string]: AppCredentials } = {};

    private constructor() {
    }

    private static instance: BFastConfig;

    static getInstance(config?: AppCredentials, appName = BFastConfig.DEFAULT_APP): BFastConfig {
        if (!BFastConfig.instance) {
            BFastConfig.instance = new BFastConfig();
        }
        if (config) {
            this.instance.credentials[appName] = config;
        }
        return BFastConfig.instance;
    }

    getAppCredential(appName = BFastConfig.DEFAULT_APP) {
        if (!this.credentials[appName]) {
            throw new Error(`The app -> ${appName} is not initialized`);
        }
        return this.credentials[appName];
    }

    getHeaders(appName: string): { [key: string]: any } {
        return {
            'Content-Type': 'application/json',
            'X-Parse-Application-Id': this.credentials[appName].applicationId
        }
    };

    getMasterHeaders(appName: string): { [key: string]: any } {
        return {
            'Content-Type': 'application/json',
            'X-Parse-Application-Id': this.credentials[appName].applicationId,
            'X-Parse-Master-Key': this.credentials[appName].appPassword,
        }
    };

    functionsURL(path: string, appName: string): string {
        if (path.startsWith('http')) {
            return path;
        }
        if (this.credentials[appName].functionsURL && this.credentials[appName].functionsURL?.startsWith('http')) {
            return `${this.credentials[appName].functionsURL}${path}` as string;
        }
        return `https://${this.credentials[appName].projectId}-faas.bfast.fahamutech.com${path}`
    };

    databaseURL(appName: string, suffix?: string): string {
        if (this.credentials[appName].databaseURL && this.credentials[appName].databaseURL?.startsWith('http')) {
            if (suffix) {
                return this.credentials[appName].databaseURL + suffix;
            } else {
                return this.credentials[appName].databaseURL as string;
            }
        }
        if (suffix) {
            return `https://${this.getAppCredential(appName).projectId}-daas.bfast.fahamutech.com${suffix}`;
        } else {
            return `https://${this.getAppCredential(appName).projectId}-daas.bfast.fahamutech.com`;
        }

    };

    getCacheDatabaseName(name: string, appName: string): string {
        if (name && name !== '') {
            return `bfast/${this.getAppCredential(appName).projectId}/${appName}/${name}`;
        } else {
            return `bfast/${this.getAppCredential(appName).projectId}/${appName}`;
        }
    }

    getCacheCollectionName(name: string, appName: string): string {
        if (name && name !== '') {
            return `${name}/${appName}`;
        } else {
            return `cache/${appName}`;
        }
    }

}

export interface AppCredentials {
    applicationId: string;
    functionsURL?: string;
    projectId: string;
    databaseURL?: string;
    appPassword?: string;
    cache?: CacheConfigOptions
}

export interface CacheConfigOptions {
    enable: boolean,
    collection?: string,
    ttlCollection?: string,
}
