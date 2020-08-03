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

    async authenticated<T extends UserModel>(options?: AuthOptions): Promise<T> {
        const user = await this.currentUser();
        if (user && user.sessionToken) {
            const getHeaders = this._geHeadersWithToken(user, options);
            const response = await this.restApi.get<T>(BFastConfig.getInstance().databaseURL(this.appName, '/users/me'), {
                headers: getHeaders
            });
            const data = response.data;
            data.token = data.sessionToken;
            return data;
        } else {
            return null as any;
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

    /**
     * @deprecated use #getToken() instead. This method will be removed in 4.x
     */
    async getSessionToken(): Promise<any> {
        const user = await this.currentUser();
        if (user && user.sessionToken) {
            return user.sessionToken;
        } else {
            return null;
        }
    }

    async getToken(): Promise<any> {

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
        await this.cacheAdapter.set<T>('_current_user_', response.data, {
            dtl: 30
        });
        const data = response.data;
        data.token = data.sessionToken;
        return data;
    }

    async logOut(options?: AuthOptions): Promise<boolean> {
        const user = await this.currentUser();
        await this.cacheAdapter.set('_current_user_', null);
        if (user && user.sessionToken) {
            const postHeader = this._geHeadersWithToken(user, options);
            this.restApi.post(BFastConfig.getInstance().databaseURL(this.appName, '/logout'), {}, {
                headers: postHeader
            }).catch(console.warn);
        }
        return true;
    }

    async requestPasswordReset<T extends UserModel>(email: string, options?: AuthOptions): Promise<T> {
        const user = await this.currentUser<T>();
        if (user && user.sessionToken) {
            const postHeader = this._geHeadersWithToken(user, options);
            const response = await this.restApi.post(BFastConfig.getInstance().databaseURL(this.appName, '/requestPasswordReset'), {
                email: user.email ? user.email : email
            }, {
                headers: postHeader
            });
            return response.data;
        } else {
            throw new Error('No current user in your device');
        }
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
        const data = response.data;
        data.token = data.sessionToken;
        Object.assign(userData, data);
        await this.cacheAdapter.set<T>('_current_user_', userData, {
            dtl: 30
        });
        return userData;
    }

    async updateUser<T extends UserModel>(userModel: UserModel, options?: AuthOptions): Promise<any> {
        const user = await this.currentUser();
        if (user && user.sessionToken) {
            const postHeaders = this._geHeadersWithToken(user, options);
            const response = await this.restApi.put<UserModel>(
                BFastConfig.getInstance().databaseURL(this.appName, '/users/' + user.objectId),
                userModel, {
                    headers: postHeaders
                });
            delete userModel.password;
            const data = response.data;
            data.token = data.sessionToken;
            Object.assign(user, data);
            Object.assign(user, userModel);
            await this.cacheAdapter.set<T>('_current_user_', user as T, {
                dtl: 30
            });
            return user;
        } else {
            throw new Error('Not current user in your device');
        }
    }

    private _geHeadersWithToken(user: UserModel, options?: AuthOptions): object {
        const postHeader = {};
        if (options && options.useMasterKey) {
            Object.assign(postHeader, {
                'X-Parse-Master-Key': BFastConfig.getInstance().getAppCredential(this.appName).appPassword,
            });
        }
        Object.assign(postHeader, {
            'X-Parse-Session-Token': user.sessionToken
        });
        Object.assign(postHeader, {
            'authorization': 'Bearer ' + user.token ? user.token : user.sessionToken
        });
        Object.assign(postHeader, {
            'X-Parse-Application-Id': BFastConfig.getInstance().getAppCredential(this.appName).applicationId
        });
        return postHeader;
    }

    async setCurrentUser<T extends UserModel>(user: T): Promise<T | null> {
        user.token = user.sessionToken;
        await this.cacheAdapter.set<T>('_current_user_', user, {
            dtl: 30
        });
        return user;
    }
}
