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

    save(options?: ParseSaveFileOptions): Promise<Parse.File> {
        return this.file.save(options);
    }

    toJSON(): { __type: string; name: string; url: string } {
        return this.file.toJSON();
    }

    url(options?: { forceSecure: boolean }): string {
        return this.file.url(options);
    }

    addMetadata(key: string, value: any): void {
        return this.file.addMetadata(key, value);
    }

    addTag(key: string, value: any): void {
        return this.file.addTag(key, value);
    }

    cancel(): void {
        this.file.cancel();
    }

    destroy(): Promise<StorageAdapter> {
        return this.file.destroy();
    }

    equals(other: StorageController): boolean {
        return this.file.equals(other);
    }

    metadata(): Record<string, any> {
        return this.file.metadata();
    }

    setMetadata(metadata: Record<string, any>): void {
        this.file.setMetadata(metadata);
    }

    setTags(tags: Record<string, any>): void {
        this.file.setTags(tags);
    }

    tags(): Record<string, any> {
        return this.file.tags();
    }

}

interface ParseSaveFileOptions extends Parse.FullOptions {
    progress: (progressValue: any, loaded: any, total: any, {type}: any) => any;
}