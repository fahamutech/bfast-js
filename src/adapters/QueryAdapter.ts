export interface RequestOptions extends CacheOptions {
    useMasterKey?: boolean,
    returnFields?: string[],
}

interface CacheOptions {
    /**
     * enable cache in method level, override global option
     */
    cacheEnable?: boolean;
    /**
     * cache to expire flag
     */
    dtl?: number;

    /**
     * callback to response from network data, just before that data is updated to cache
     * @param identifier {string} cache identifier
     * @param data {T extend object} fresh data from network
     // * @deprecated use #onUpdated
     */
    freshDataCallback?: <T>(value: { identifier: string, data: T }) => void;

    // /**
    //  * callback to response from network data, just before that data is updated to cache
    //  * @param identifier {string} cache identifier
    //  * @param data {T extend object} fresh data from network
    //  */
    // onUpdated?: <T>(value: { identifier: string, data: T }) => void;
}

// According to https://parseplatform.org/Parse-SDK-JS/api/2.1.0/Parse.Query.html#fullText
export interface FullTextOptions {
    language?: string;
    caseSensitive?: boolean;
    diacriticSensitive?: boolean;
}
