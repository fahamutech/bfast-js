import {UserModel} from "../models/UserModel";
import {AuthAdapter, AuthOptions} from "../adapters/AuthAdapter";
import {BFastConfig} from "../conf";
import {AxiosRestController} from "../controllers/AxiosRestController";

export class DefaultAuthFactory implements AuthAdapter {
    restApi = new AxiosRestController();

    async authenticated<T extends UserModel>(userId: string, options?: AuthOptions): Promise<any> {
        return false;
    }


    async logIn<T extends UserModel>(username: string, password: string, appName: string, options?: AuthOptions): Promise<T> {
        const authRule = {};
        Object.assign(authRule, {
            'applicationId': BFastConfig.getInstance().credential(appName).applicationId
        });
        Object.assign(authRule, {
            auth: {
                signIn: {
                    username,
                    password
                }
            }
        });
        const response = await this.restApi.post<T>(BFastConfig.getInstance().databaseURL(appName), authRule, {
            headers: {
                'x-parse-application-id': BFastConfig.getInstance().credential(appName).applicationId
            }
        });
        const data = response.data;
        if (data && data.auth && data.auth.signIn) {
            return data.auth.signIn;
        } else {
            throw {message: data.errors && data.errors['auth.sigIn'] ? data.errors['auth.sigIn'].message : 'Username/Password is not valid'};
        }
    }

    async logOut(options?: AuthOptions): Promise<boolean> {
        return true;
    }

    async requestPasswordReset<T extends UserModel>(email: string, appName: string, options?: AuthOptions): Promise<any> {
        const authRule = {};
        Object.assign(authRule, {
            'applicationId': BFastConfig.getInstance().credential(appName).applicationId
        });
        Object.assign(authRule, {
            auth: {
                reset: {
                    email
                }
            }
        });
        const response = await this.restApi.post<T>(BFastConfig.getInstance().databaseURL(appName), authRule, {
            headers: {
                'x-parse-application-id': BFastConfig.getInstance().credential(appName).applicationId
            }
        });
        const data = response.data;
        if (data && data.auth && data.auth.reset) {
            return data.auth.reset;
        } else {
            throw {message: data.errors && data.errors.auth && data.errors['auth.reset'] ? data.errors['auth.reset'].message : 'Fails to reset password'};
        }
    }

    async signUp<T extends UserModel>(username: string, password: string, attrs: { [key: string]: any } = {}, appName: string, options?: AuthOptions): Promise<T> {
        const authRule = {};
        Object.assign(authRule, {
            'applicationId': BFastConfig.getInstance().credential(appName).applicationId
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
        const response = await this.restApi.post<T>(BFastConfig.getInstance().databaseURL(appName), authRule, {
            headers: {
                'x-parse-application-id': BFastConfig.getInstance().credential(appName).applicationId
            }
        });
        const data = response.data;
        if (data && data.auth && data.auth.signUp) {
            return data.auth.signUp;
        } else {
            throw {message: data.errors && data.errors.auth && data.errors['auth.signUp'] ? data.errors['auth.signUp'].message : 'Username/Email already exist'};
        }
    }

    updateUser<T extends UserModel>(id: string, attrs: object, options?: AuthOptions): Promise<any> {
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

    requestEmailVerification<T extends UserModel>(email: string, appName: string, options?: AuthOptions): Promise<T> {
        throw 'Not supported yet use your implementation';
    }


}
