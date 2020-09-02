import {UserModel} from "../models/UserModel";

export interface AuthAdapter {

    authenticated<T extends UserModel>(userId: string, options?: AuthOptions): Promise<T>;

    updateUser<T extends UserModel>(id: string, attrs: object, options?: AuthOptions): Promise<any>;

    signUp<T extends UserModel>(username: string, password: string, attrs: object, appName: string, options?: AuthOptions): Promise<T>;

    logIn<T extends UserModel>(username: string, password: string, appName: string, options?: AuthOptions): Promise<T>;

    logOut(options?: AuthOptions): Promise<boolean>;

    requestPasswordReset<T extends UserModel>(email: string, appName: string, options?: AuthOptions): Promise<T>;
    requestEmailVerification<T extends UserModel>(email: string, appName: string, options?: AuthOptions): Promise<T>;
}

export interface AuthOptions {
    useMasterKey?: boolean;
    token?: string;
}
