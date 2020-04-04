import {StorageAdapter} from "../core/storageAdapter";

export class StorageController implements StorageAdapter {
    constructor(private file: Parse.File) {
    }

    getData(): Promise<string> {
        return this.file.getData();
    }

    name(): string {
        return this.file.name()
    }

    save(options?: Parse.SuccessFailureOptions): Promise<Parse.File> {
        return this.file.save(options);
    }

    toJSON(): { __type: string; name: string; url: string } {
        return this.file.toJSON();
    }

    url(options?: { forceSecure: boolean }): string {
        return this.file.url(options);
    }

}
