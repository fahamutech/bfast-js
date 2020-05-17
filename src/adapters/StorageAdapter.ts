import {AuthOptions} from "./AuthAdapter";

export interface StorageAdapter {
    getData(): string;

    /**
     * when done saving must return a url of a file
     * @param file
     * @param options
     */
    save(file: { fileName: string, data: { base64: string }, fileType: string }, options?: FileOptions): Promise<{ url: string }>;

    // delete(filename: string): Promise<any>;
}

export interface FileOptions extends AuthOptions {
    progress: (progressValue: any, loaded: any, total: any, {type}: any) => any;
    forceSecure?: boolean
}
