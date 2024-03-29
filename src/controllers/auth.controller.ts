import {AuthAdapter, AuthOptions} from "../adapters/auth.adapter";
import {UserModel} from "../models/UserModel";
import {CacheController} from "./cache.controller";
import {ConstantUtil} from "../utils/constant.util";

export class AuthController {

    constructor(
        private readonly appName: string,
        private readonly cacheController: CacheController,
        private readonly authAdapter: AuthAdapter
    ) {
    }

    async authenticated(userId: string, options?: AuthOptions): Promise<any> {
        return this.authAdapter.authenticated(userId, options);
    }

    async currentUser(): Promise<any> {
        try {
            const user: any = await this.cacheController.get(ConstantUtil.CURRENT_USER_IDENTIFIER, {secure: true});
            if (!user) {
                return null;
            } else if (typeof user === "string") {
                await this.setCurrentUser(null);
                return null;
            } else {
                return user;
            }
        } catch (e) {
            await this.setCurrentUser(null);
            return null;
        }
    }

    async getEmail(): Promise<any> {
        const user = await this.currentUser();
        if (user && user.email) {
            return user.email;
        } else {
            return null;
        }
    }

    async getToken(): Promise<any> {
        const user = await this.currentUser();
        if (user && user.token) {
            return user.token;
        } else {
            return null;
        }
    }

    async getUsername(): Promise<any> {
        const user = await this.currentUser();
        if (user && user.username) {
            return user.username;
        } else {
            return null;
        }
    }

    async logIn(username: string, password: string, dtl = 6, options?: AuthOptions): Promise<any> {
        if (!username) {
            throw {message: "Username required"};
        }
        if (!password) {
            throw {message: "Password required"}
        }
        username = username.trim();
        password = password.trim();
        const user: any = await this.authAdapter.logIn(username, password, this.appName, options);
        await this.setCurrentUser(user, dtl);
        return user;
    }

    async logOut(options?: AuthOptions): Promise<boolean> {
        await this.setCurrentUser(null);
        return this.authAdapter.logOut(options);
    }

    async requestPasswordReset<T extends UserModel>(email: string, options?: AuthOptions): Promise<any> {
        if (!email) {
            throw {message: "Email required to reset your account"};
        }
        return this.authAdapter.requestPasswordReset(email, this.appName, options);
    }

    async signUp(username: string, password: string, attrs: { [key: string]: any } = {}, dtl = 6, options?: AuthOptions): Promise<any> {
        if (!username) {
            throw {message: "Username required"};
        }
        if (!password) {
            throw {message: "Password required"}
        }
        username = username.trim();
        password = password.trim();
        const user: any = await this.authAdapter.signUp(username, password, attrs, this.appName, options);
        await this.setCurrentUser(user, dtl);
        return user;
    }

    async updateUser(userId: string, attrs: { [key: string]: any } = {}, options?: AuthOptions): Promise<any> {
        if (!userId) {
            throw {message: "Please provide id of user to be updated"};
        }
        return this.authAdapter.updateUser(userId, attrs, options);
    }

    async setCurrentUser(user: { [key: string]: any } | null, dtl = 6): Promise<any> {
        await this.cacheController.set(ConstantUtil.CURRENT_USER_IDENTIFIER, user, {
            secure: true
        });
        return user;
    }

    async requestEmailVerification(email: string, options?: AuthOptions): Promise<any> {
        if (!email) {
            throw {message: "Email required"}
        }
        return this.authAdapter.requestEmailVerification(email, this.appName, options)
    }
}
