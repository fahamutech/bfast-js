import {AuthAdapter} from '../adapters/AuthAdapter';
import {CacheAdapter} from '../adapters/CacheAdapter';
import {HttpClientAdapter} from '../adapters/HttpClientAdapter';
import {CacheConfigOptions} from '../models/CacheConfigOptions';

export interface AppCredentials {
  applicationId: string;
  functionsURL?: string;
  projectId: string;
  databaseURL?: string;
  appPassword?: string;
  cache?: CacheConfigOptions;
  adapters?: {
    auth?: () => AuthAdapter,
    cache?: () => CacheAdapter,
    http?: () => HttpClientAdapter
  };
}
