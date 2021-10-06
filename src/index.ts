import {auth, cache, database, functions, getConfig, init, storage} from './bfast';
import {ConstantUtil} from './utils/constant.util';
import {extractResultFromServer} from './utils/data.util';
import {isBrowser, isElectron, isNode, isWebWorker} from './utils/platform.util';
import {AuthAdapter} from './adapters/auth.adapter';
import {CacheAdapter} from './adapters/cache.adapter';
import {HttpClientAdapter} from './adapters/http-client.adapter';

export {
    init,
    auth,
    ConstantUtil,
    storage,
    cache,
    functions,
    getConfig,
    database,
    AuthAdapter,
    CacheAdapter,
    HttpClientAdapter,
    extractResultFromServer,
    isNode,
    isBrowser,
    isWebWorker,
    isElectron,
}
