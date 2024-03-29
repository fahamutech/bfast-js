import {CacheAdapter} from "../adapters/cache.adapter";
import {DefaultCacheFactory} from "./default-cache.factory";
import {getConfig} from '../bfast';

export function cacheAdapter(appName: string): CacheAdapter {
    const config = getConfig();
    const credentials = config.credential(appName);
    const adapters = credentials?.adapters;
    if (adapters && adapters.cache && typeof adapters.cache === "function") {
        return adapters.cache();
    } else if (
        adapters && adapters.cache
        && typeof adapters.cache === 'string'
        && config.credential(adapters.cache)
        && config.credential(adapters.cache).adapters
        && config.credential(adapters.cache).adapters?.cache
        && typeof config.credential(adapters.cache).adapters?.cache === "function") {
        const _adapters = config.credential(adapters.cache)?.adapters;
        // @ts-ignore
        return _adapters.cache();
    } else {
        return new DefaultCacheFactory();
    }
}
