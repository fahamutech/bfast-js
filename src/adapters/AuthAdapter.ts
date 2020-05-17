import {UserModel} from "../model/UserModel";

export interface AuthAdapter {

    authenticated<T extends UserModel>(): Promise<T>;

    getEmail(): Promise<string>;

    getUsername(): Promise<string>;

    updateUser<T extends UserModel>(userModel: UserModel, options?: AuthOptions): Promise<any>;

    getSessionToken(): Promise<string>;

    currentUser<T extends UserModel>(): Promise<T | null>;

    signUp<T extends UserModel>(username: string, password: string, attrs: UserModel, options?: AuthOptions): Promise<T>;

    logIn<T extends UserModel>(username: string, password: string, options?: AuthOptions): Promise<T>;

    logOut(options?:AuthOptions): Promise<boolean>;

    requestPasswordReset<T extends UserModel>(email: string, options?: AuthOptions): Promise<T>;
}

export interface AuthOptions {
    useMasterKey?: boolean;
    sessionToken?: string;
    // installationId?: string;
}
