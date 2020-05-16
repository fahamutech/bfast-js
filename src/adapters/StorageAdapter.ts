import {AuthOptions} from "./AuthAdapter";

export interface StorageAdapter {
    getData(): string;

    // url(options?: { forceSecure?: boolean }): string;

    // metadata(): Record<string, any>;

    // tags(): Record<string, any>;

    // name(): string;

    /**
     * when done saving must return a url of a file
     * @param options
     */
    save(options?: FileOptions): Promise<{ url: string, name: string }>;

    // destroy(): Promise<this>;

    // setMetadata(metadata: Record<string, any>): void;
    //
    // addMetadata(key: string, value: any): void;
    //
    // setTags(tags: Record<string, any>): void;
    //
    // addTag(key: string, value: any): void;
}

export interface FileOptions extends AuthOptions {
    progress: (progressValue: any, loaded: any, total: any, {type}: any) => any;
    forceSecure?: boolean
}
