import {RestAdapter} from "../adapters/RestAdapter";
import {AuthAdapter, AuthOptions} from "../adapters/AuthAdapter";
import {UserModel} from "../model/UserModel";
import {CacheAdapter} from "../adapters/CacheAdapter";
import {BFastConfig} from "../conf";

export class AuthController implements AuthAdapter {
    constructor(private readonly restApi: RestAdapter,
                private readonly cacheAdapter: CacheAdapter,
                private readonly appName: string) {
    }

    async authenticated(options?: AuthOptions): Promise<boolean> {
        const user = await this.currentUser();
        if (user && user.sessionToken) {
            const getHeaders = {};
            if (options && options.useMasterKey) {
                Object.assign(getHeaders, {
                    'X-Parse-Master-Key': BFastConfig.getInstance().getAppCredential(this.appName).appPassword,
                });
            }
            Object.assign(getHeaders, {
                'X-Parse-Session-Token': user.sessionToken
            });
            Object.assign(getHeaders, {
                'X-Parse-Application-Id': BFastConfig.getInstance().getAppCredential(this.appName).applicationId
            });
            const response = await this.restApi.get<UserModel>(BFastConfig.getInstance().databaseURL(this.appName, '/users/me'), {
                headers: getHeaders
            });
            return !!response.data;
        } else {
            return false;
        }
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

    async getSessionToken(): Promise<any> {
        const user = await this.currentUser();
        if (user && user.sessionToken) {
            return user.sessionToken;
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

    // @ts-ignore
    async logIn<T extends UserModel>(username: string, password: string, options?: AuthOptions): Promise<T> {
        const getHeader = {};
        if (options && options.useMasterKey) {
            Object.assign(getHeader, {
                'X-Parse-Master-Key': BFastConfig.getInstance().getAppCredential(this.appName).appPassword,
            });
        }
        Object.assign(getHeader, {
            'X-Parse-Application-Id': BFastConfig.getInstance().getAppCredential(this.appName).applicationId
        });
        const response = await this.restApi.get<T>(BFastConfig.getInstance().databaseURL(this.appName, '/login'), {
            params: {
                username: username,
                password: password
            },
            headers: getHeader
        });
        return await this.cacheAdapter.set<T>('_current_user_', response.data, {
            dtl: 30
        });
    }

    async logOut(): Promise<boolean> {
        await this.cacheAdapter.set('_current_user_', null);
        return true;
    }

    async requestPasswordReset<T extends Parse.User>(email: string, options?: AuthOptions): Promise<T> {
        const postHeader = {};
        if (options && options.useMasterKey) {
            Object.assign(postHeader, {
                'X-Parse-Master-Key': BFastConfig.getInstance().getAppCredential(this.appName).appPassword,
            });
        }
        if (options && options.sessionToken) {
            const user = await this.currentUser();
            Object.assign(postHeader, {
                'X-Parse-Session-Token': user?.sessionToken
            });
        }
        Object.assign(postHeader, {
            'X-Parse-Application-Id': BFastConfig.getInstance().getAppCredential(this.appName).applicationId
        });
        const response = await this.restApi.post(BFastConfig.getInstance().databaseURL(this.appName, '/requestPasswordReset'), {
            email: email
        }, {
            headers: postHeader
        });
        return response.data;
    }

    async signUp<T extends UserModel>(username: string, password: string, attrs: { [key: string]: any }, options?: AuthOptions): Promise<T> {
        const postHeaders = {};
        if (options && options.useMasterKey) {
            Object.assign(postHeaders, {
                'X-Parse-Master-Key': BFastConfig.getInstance().getAppCredential(this.appName).appPassword,
            });
        }
        Object.assign(postHeaders, {
            'X-Parse-Application-Id': BFastConfig.getInstance().getAppCredential(this.appName).applicationId
        });
        const userData: any = {};
        userData.username = username;
        userData.password = password;
        Object.assign(userData, attrs);
        const response = await this.restApi.post(BFastConfig.getInstance().databaseURL(this.appName, '/users'), userData, {
            headers: postHeaders
        });
        delete userData.password;
        Object.assign(userData, response.data);
        return await this.cacheAdapter.set<T>('_current_user_', userData);
    }

    async updateUser<T extends UserModel>(userModel: UserModel, options?: AuthOptions): Promise<any> {
        const user = await this.currentUser();
        if (user && user.sessionToken) {
            const postHeaders = {};
            if (options && options.useMasterKey) {
                Object.assign(postHeaders, {
                    'X-Parse-Master-Key': BFastConfig.getInstance().getAppCredential(this.appName).appPassword,
                });
            }
            Object.assign(postHeaders, {
                'X-Parse-Session-Token': user.sessionToken
            });
            Object.assign(postHeaders, {
                'X-Parse-Application-Id': BFastConfig.getInstance().getAppCredential(this.appName).applicationId
            });
            const response = await this.restApi.put<UserModel>(BFastConfig.getInstance().databaseURL(this.appName, '/users/me'), userModel, {
                headers: postHeaders
            });
            delete userModel.password;
            Object.assign(user, response.data);
            Object.assign(user, userModel);
            return await this.cacheAdapter.set<T>('_current_user_', user as T);
        } else {
            throw new Error('Not current user in your device');
        }
    }
}
