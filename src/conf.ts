import {AuthAdapter} from "./adapters/auth.adapter";
import {CacheAdapter} from "./adapters/cache.adapter";
import {HttpClientAdapter} from "./adapters/http-client.adapter";
import {DefaultCacheFactory} from "./factories/default-cache.factory";
import {DefaultAuthFactory} from "./factories/default-auth.factory";
import {SecurityController} from "./controllers/security.controller";
import {DefaultHttpClientFactory} from "./factories/default-http-client.factory";
import {HttpClientController} from "./controllers/http-client.controller";

export class BFastConfig {
    static DEFAULT_APP = 'DEFAULT';
    DEFAULT_CACHE_DB_BFAST = '_BFast';
    DEFAULT_CACHE_DB_AUTH = '_Auth';
    DEFAULT_CACHE_COLLECTION_USER = '_User';
    DEFAULT_CACHE_COLLECTION_STORAGE = '_Storage';
    DEFAULT_CACHE_COLLECTION_REST = '_Rest';
    DEFAULT_CACHE_COLLECTION_CACHE = '_Cache';
    DEFAULT_CACHE_COLLECTION_TTL = '_Cache_Ttl';

    private credentials: { [key: string]: AppCredentials } = {};

    private constructor() {
    }

    private static instance: BFastConfig;

    static getInstance(): BFastConfig {
        if (!BFastConfig.instance) {
            BFastConfig.instance = new BFastConfig();
        }
        return BFastConfig.instance;
    }

    setCredential(config: AppCredentials, appName = BFastConfig.DEFAULT_APP) {
        if (!BFastConfig.instance) {
            throw new Error("Call BFast.init() to initialize configurations first")
        }
        BFastConfig.instance.credentials[appName] = config;
    }

    credential(appName = BFastConfig.DEFAULT_APP) {
        if (!this.credentials[appName]) {
            throw new Error(`The app -> ${appName} is not initialized`);
        }
        return this.credentials[appName];
    }

    functionsURL(path: string, appName: string): string {
        if (path.startsWith('http')) {
            return path;
        }
        if (this.credentials[appName].functionsURL && this.credentials[appName].functionsURL?.startsWith('http')) {
            return `${this.credentials[appName].functionsURL}${path}` as string;
        }
        return `https://${this.credentials[appName].projectId}-faas.bfast.fahamutech.com${path}`
    };

    databaseURL(appName: string, suffix = '/v2'): string {
        if (this.credentials[appName].databaseURL && this.credentials[appName].databaseURL?.startsWith('http')) {
            if (suffix) {
                return this.credentials[appName].databaseURL + suffix;
            } else {
                return this.credentials[appName].databaseURL as string;
            }
        }
        if (suffix) {
            return `https://${this.credential(appName).projectId}-daas.bfast.fahamutech.com${suffix}`;
        } else {
            return `https://${this.credential(appName).projectId}-daas.bfast.fahamutech.com`;
        }

    };

    cacheDatabaseName(name: string, appName: string): string {
        if (name && name !== '') {
            return `bfast/${this.credential(appName).projectId}/${name}`;
        } else {
            return `bfast/${this.credential(appName).projectId}/cache`;
        }
    }

    cacheCollectionName(name: string, appName: string): string {
        if (name && name !== '') {
            return name.trim();
        } else {
            return this.DEFAULT_CACHE_COLLECTION_CACHE;
        }
    }

    authAdapter(appName: string): AuthAdapter {
        const adapters = this.credential(appName)?.adapters;
        if (adapters && adapters.auth && typeof adapters.auth === 'function') {
            return adapters.auth();
        } else {
            return new DefaultAuthFactory(
                new HttpClientController(
                    appName,
                    this.httpAdapter(appName)
                )
            );
        }
    }

    cacheAdapter(appName: string): CacheAdapter {
        const credentials = this.credential(appName);
        const adapters = credentials?.adapters;
        if (adapters && adapters.cache && typeof adapters.cache === "function") {
            return adapters.cache();
        } else {
            return new DefaultCacheFactory(
                new SecurityController(
                    credentials.projectId ? credentials.projectId : 'bfast'
                )
            );
        }
    }

    httpAdapter(appName: string): HttpClientAdapter {
        const adapters = this.credential(appName)?.adapters;
        if (adapters && adapters.http && typeof adapters.http === "function") {
            return adapters.http();
        } else {
            return new DefaultHttpClientFactory();
        }
    }
}

export interface AppCredentials {
    applicationId: string;
    functionsURL?: string;
    projectId: string;
    databaseURL?: string;
    appPassword?: string;
    cache?: CacheConfigOptions;
    adapters?: {
        auth?: (config?: BFastConfig) => AuthAdapter,
        cache?: (config?: BFastConfig) => CacheAdapter,
        http?: (config?: BFastConfig) => HttpClientAdapter
    }
}

export interface CacheConfigOptions {
    enable: boolean,
    collection?: string,
    ttlCollection?: string,
}
