import {HttpClientAdapter} from "../adapters/HttpClientAdapter";
import {AuthAdapter, AuthOptions} from "../adapters/AuthAdapter";
import {UserModel} from "../model/UserModel";
import {CacheAdapter} from "../adapters/CacheAdapter";
import {BFastConfig} from "../conf";

export class AuthController implements AuthAdapter {
    constructor(private readonly restApi: HttpClientAdapter,
                private readonly cacheAdapter: CacheAdapter,
                private readonly appName: string) {
    }

    async authenticated<T extends UserModel>(options?: AuthOptions): Promise<any> {
        return await this.currentUser();
    }

    async currentUser<T extends UserModel>(): Promise<T | null> {
        return await this.cacheAdapter.get<T>('_current_user_');
    }

    async getEmail(): Promise<any> {
        const user = await this.currentUser();
        if (user && user.email) {
            return user.email;
        } else {
            return null;
        }
    }

    /**
     * @deprecated use #getToken() instead. This method will be removed in 4.x
     */
    async getSessionToken(): Promise<any> {
        return this.getToken();
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

    async logIn<T extends UserModel>(username: string, password: string, options?: AuthOptions): Promise<T> {
        const authRule = {};
        Object.assign(authRule, {
            'applicationId': BFastConfig.getInstance().getAppCredential(this.appName).applicationId
        });
        Object.assign(authRule, {
            auth: {
                signIn: {
                    username,
                    password
                }
            }
        });
        const response = await this.restApi.post<T>(BFastConfig.getInstance().databaseURL(this.appName), authRule);
        const data = response.data;
        if (data && data.auth && data.auth.signIn) {
            await this.cacheAdapter.set<T>('_current_user_', data.auth.signIn, {
                dtl: 7
            });
            return data.auth.signIn;
        } else {
            throw {message: data.errors && data.errors.auth && data.errors.auth.signIn ? data.errors.auth.signIn.message : 'Fails to login'};
        }
    }

    async logOut(options?: AuthOptions): Promise<boolean> {
        await this.cacheAdapter.set('_current_user_', null);
        return true;
    }

    async requestPasswordReset<T extends UserModel>(email: string, options?: AuthOptions): Promise<any> {
        const authRule = {};
        Object.assign(authRule, {
            'applicationId': BFastConfig.getInstance().getAppCredential(this.appName).applicationId
        });
        Object.assign(authRule, {
            auth: {
                reset: {
                    email
                }
            }
        });
        const response = await this.restApi.post<T>(BFastConfig.getInstance().databaseURL(this.appName), authRule);
        const data = response.data;
        if (data && data.auth && data.auth.reset) {
            return data.auth.reset;
        } else {
            throw {message: data.errors && data.errors.auth && data.errors.auth.reset ? data.errors.auth.reset.message : 'Fails to reset password'};
        }
    }

    async signUp<T extends UserModel>(username: string, password: string, attrs: { [key: string]: any } = {}, options?: AuthOptions): Promise<T> {
        const authRule = {};
        Object.assign(authRule, {
            'applicationId': BFastConfig.getInstance().getAppCredential(this.appName).applicationId
        });
        Object.assign(attrs, {
            username,
            password
        });
        attrs.email = attrs.email ? attrs.email : '';
        Object.assign(authRule, {
            auth: {
                signUp: attrs
            }
        });
        const response = await this.restApi.post<T>(BFastConfig.getInstance().databaseURL(this.appName), authRule);
        const data = response.data;
        if (data && data.auth && data.auth.signUp) {
            await this.cacheAdapter.set<T>('_current_user_', data.auth.signUp, {
                dtl: 7
            });
            return data.auth.signUp;
        } else {
            throw {message: data.errors && data.errors.auth && data.errors.auth.signUp ? data.errors.auth.signUp.message : 'Fails to signUp'};
        }
    }

    async updateUser<T extends UserModel>(userModel: UserModel, options?: AuthOptions): Promise<any> {
        throw {message: "Not supported, use _User collection in your secure env with masterKey to update user details"};
        // const user = await this.currentUser();
        // if (user && user.token) {
        //     const postHeaders = this._geHeadersWithToken(user, options);
        //     const response = await this.restApi.put<UserModel>(
        //         BFastConfig.getInstance().databaseURL(this.appName, '/users/' + user.objectId),
        //         userModel, {
        //             headers: postHeaders
        //         });
        //     delete userModel.password;
        //     const data = response.data;
        //     data.token = data.sessionToken;
        //     Object.assign(user, data);
        //     Object.assign(user, userModel);
        //     await this.cacheAdapter.set<T>('_current_user_', user as T, {
        //         dtl: 30
        //     });
        //     return user;
        // } else {
        //     throw new Error('No current user in your device');
        // }
    }

    async setCurrentUser<T extends UserModel>(user: T): Promise<T | null> {
        await this.cacheAdapter.set<T>('_current_user_', user, {
            dtl: 6
        });
        return user;
    }
}
