export interface UserModel {
    objectId?: string;
    createdAt?: any;
    updatedAt?: any;
    sessionToken?: string;
    username: string;
    password?: string;
    email?: string;
    [key: string]: any
}
