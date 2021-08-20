import {UserModel} from "../models/UserModel";

export abstract class AuthAdapter {
    abstract authenticated<T extends UserModel>(userId: string, options?: AuthOptions): Promise<T>;

    abstract updateUser<T extends UserModel>(id: string, attrs: object, options?: AuthOptions): Promise<any>;

    abstract signUp<T extends UserModel>(username: string, password: string, attrs: object, appName: string, options?: AuthOptions): Promise<T>;

    abstract logIn<T extends UserModel>(username: string, password: string, appName: string, options?: AuthOptions): Promise<T>;

    abstract logOut(options?: AuthOptions): Promise<boolean>;

    abstract requestPasswordReset<T extends UserModel>(email: string, appName: string, options?: AuthOptions): Promise<T>;

    abstract requestEmailVerification<T extends UserModel>(email: string, appName: string, options?: AuthOptions): Promise<T>;
}

export interface AuthOptions {
    useMasterKey?: boolean;
    token?: string;
}
