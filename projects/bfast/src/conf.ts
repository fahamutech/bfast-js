import {AuthAdapter} from './adapters/AuthAdapter';
import {CacheAdapter} from './adapters/CacheAdapter';
import {HttpClientAdapter} from './adapters/HttpClientAdapter';
import {DefaultCacheFactory} from './factories/cache';
import {DefaultAuthFactory} from './factories/auth';
import {SecurityController} from './controllers/SecurityController';
import {AppCredentials} from './models/AppCredentials';
import {AxiosRestController} from './controllers/AxiosRestController';

// @dynamic
export class BFastConfig {

  private constructor() {
  }

  static DEFAULT_APP = 'DEFAULT';

  private static instance: BFastConfig;
  private _DEFAULT_DOMAINS_CACHE_DB_NAME = '__domain';

  private credentials: { [key: string]: AppCredentials } = {};

  private _DEFAULT_AUTH_CACHE_DB_NAME = '__auth';

  private _DEFAULT_CACHE_DB_NAME = '__cache';

  private _DEFAULT_CACHE_TTL_COLLECTION_NAME = '__cache_ttl';

  static getInstance(): BFastConfig {
    if (!BFastConfig.instance) {
      BFastConfig.instance = new BFastConfig();
    }
    return BFastConfig.instance;
  }

  DEFAULT_DOMAINS_CACHE_DB_NAME(): string {
    return this._DEFAULT_DOMAINS_CACHE_DB_NAME;
  }

  DEFAULT_AUTH_CACHE_DB_NAME(): string {
    return this._DEFAULT_AUTH_CACHE_DB_NAME;
  }

  DEFAULT_CACHE_DB_NAME(): string {
    return this._DEFAULT_CACHE_DB_NAME;
  }

  DEFAULT_CACHE_TTL_COLLECTION_NAME(): string {
    return this._DEFAULT_CACHE_TTL_COLLECTION_NAME;
  }

  setCredential(config: AppCredentials, appName = BFastConfig.DEFAULT_APP): void {
    if (!BFastConfig.instance) {
      throw new Error('Call BFast.init() to initialize configurations first');
    }
    BFastConfig.instance.credentials[appName] = config;
  }

  credential(appName = BFastConfig.DEFAULT_APP): AppCredentials {
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
    return `https://${this.credentials[appName].projectId}-faas.bfast.fahamutech.com${path}`;
  }

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

  }

  cacheDatabaseName(name: string, appName: string): string {
    if (name && name !== '') {
      return `bfast/${this.credential(appName).projectId}/${appName}/${name}`;
    } else {
      return `bfast/${this.credential(appName).projectId}/${appName}`;
    }
  }

  cacheCollectionName(name: string, appName: string): string {
    if (name && name !== '') {
      return `${name}/${appName}`;
    } else {
      return `cache/${appName}`;
    }
  }

  authAdapter(appName: string): AuthAdapter {
    const adapters = this.credential(appName)?.adapters;
    if (adapters && adapters.auth && typeof adapters.auth === 'function') {
      return adapters.auth();
    } else {
      return new DefaultAuthFactory(new AxiosRestController(), BFastConfig.getInstance());
    }
  }

  cacheAdapter(appName: string): CacheAdapter {
    const credentials = this.credential(appName);
    const adapters = credentials?.adapters;
    if (adapters && adapters.cache && typeof adapters.cache === 'function') {
      return adapters.cache();
    } else {
      return new DefaultCacheFactory(new SecurityController(credentials.projectId ? credentials.projectId : '_@bfast@_'));
    }
  }

  httpAdapter(appName: string): HttpClientAdapter | null {
    const adapters = this.credential(appName)?.adapters;
    if (adapters && adapters.http && typeof adapters.http === 'function') {
      return adapters.http();
    } else {
      return null;
    }
  }
}
