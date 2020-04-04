import {AuthAdapter} from "../core/authAdapter";

export class AuthController implements AuthAdapter {

    constructor(private user: Parse.User) {
    }

    authenticated(): boolean {
        return this.user.authenticated();
    }

    getEmail(): string | undefined {
        return this.user.getEmail();
    }

    getSessionToken(): string {
        return this.user.getSessionToken();
    }

    getUsername(): string | undefined {
        return this.user.getUsername();
    }

    isCurrent(): boolean {
        return this.user.isCurrent();
    }

    logIn(options?: Parse.FullOptions): Promise<Parse.User> {
        return this.user.logIn(options);
    }

    setEmail(email: string, options?: Parse.SuccessFailureOptions): boolean {
        return this.user.setEmail(email, options);
    }

    setPassword(password: string, options?: Parse.SuccessFailureOptions): boolean {
        return this.user.setPassword(password, options);
    }

    setUsername(username: string, options?: Parse.SuccessFailureOptions): boolean {
        return this.user.setUsername(username, options);
    }

    signUp(attrs?: any, options?: Parse.SignUpOptions): Promise<Parse.User> {
        return this.user.signUp(attrs);
    }

}
