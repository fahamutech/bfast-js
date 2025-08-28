import {BfastFunctions} from "./bfast.functions";

export function functions(): BfastFunctions {
    // @ts-ignore
    return new BfastFunctions(appName, null, null);
}
