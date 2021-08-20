import {BFastConfig} from "../conf";
import {HttpClientAdapter} from "../adapters/http-client.adapter";
import {DefaultHttpClientFactory} from "./default-http-client.factory";

export function httpAdapter(config: BFastConfig,appName: string): HttpClientAdapter {
    const adapters = config.credential(appName)?.adapters;
    if (adapters && adapters.http && typeof adapters.http === "function") {
        return adapters.http();
    } else if (
        adapters && adapters.http
        && typeof adapters.http === 'string'
        && config.credential(adapters.http)
        && config.credential(adapters.http).adapters
        && config.credential(adapters.http).adapters?.http
        && typeof config.credential(adapters.http).adapters?.http === "function") {
        const _adapters = config.credential(adapters.http)?.adapters;
        // @ts-ignore
        return _adapters.http();
    } else {
        return new DefaultHttpClientFactory();
    }
}
