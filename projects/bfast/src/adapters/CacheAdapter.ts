import {RequestOptions} from '../controllers/QueryController';

export interface CacheAdapter {
  set<T>(identifier: string, data: T, database: string, collection: string, options?: { dtl?: number, secure?: boolean }): Promise<T>;

  get<T>(identifier: string, database: string, collection: string, options?: { secure?: boolean }): Promise<T>;

  keys(database: string, collection: string): Promise<string[] | undefined>;

  clearAll(database: string, collection: string): Promise<boolean>;

  remove(identifier: string, database: string, collection: string, force?: boolean): Promise<boolean>;

  cacheEnabled(appName: string, options?: RequestOptions): boolean;
}
