import {AuthAdapter} from "../adapters/auth.adapter";
import {BFastConfig} from "../conf";
import {DefaultAuthFactory} from "./default-auth.factory";
import {HttpClientController} from "../controllers/http-client.controller";
import {httpAdapter} from "./http-adapter.factory";

export function authAdapter(config: BFastConfig, appName: string): AuthAdapter {
    const adapters = config.credential(appName)?.adapters;
    if (adapters && adapters.auth && typeof adapters.auth === 'function') {
        return adapters.auth();
    } else if (
        adapters && adapters.auth
        && typeof adapters.auth === 'string'
        && config.credential(adapters.auth)
        && config.credential(adapters.auth).adapters
        && config.credential(adapters.auth).adapters?.auth
        && typeof config.credential(adapters.auth).adapters?.auth === "function") {
        const _adapters = config.credential(adapters.auth)?.adapters;
        // @ts-ignore
        return _adapters.auth();
    } else {
        return new DefaultAuthFactory(
            new HttpClientController(
                appName,
                httpAdapter(config,appName)
            )
        );
    }
}
