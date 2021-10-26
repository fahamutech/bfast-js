import {YMapEvent} from 'yjs';
import {YMap} from 'yjs/dist/src/types/YMap';
import {set} from "../utils/syncs.util";
import {CacheAdapter} from "../adapters/cache.adapter";

export class SyncChangesController {
    constructor(private readonly projectId: string,
                private readonly treeName: string,
                private readonly cacheAdapter: CacheAdapter,
                private readonly yMap: () => YMap<any>,
                private readonly destroy: () => void) {
    }

    get size() {
        return this.yMap().size;
    };

    get(key: string) {
        return this.yMap().get(key);
    }

    set(value: { id: string, [key: string]: any }): any {
        set(value, this.yMap());
        // if (!!r?.s) {
        //     addSyncs(
        //         this.projectId,
        //         {
        //             action: "create",
        //             tree: this.treeName,
        //             payload: value
        //         },
        //         this.cacheAdapter
        //     ).catch(console.log);
        // }
    }

    delete(key: string): void {
        this.yMap().delete(key);
        // addSyncs(
        //     this.projectId,
        //     {
        //         action: "delete",
        //         tree: this.treeName,
        //         payload: {id: key}
        //     },
        //     this.cacheAdapter
        // ).catch(console.log);
    }

    has(key: string): boolean {
        return this.yMap().has(key);
    }

    toJSON(): { [key: string]: any } {
        return this.yMap().toJSON();
    }

    entries(): IterableIterator<any> {
        return this.yMap().entries();
    }

    values(): IterableIterator<any> {
        return this.yMap().values();
    }

    keys(): IterableIterator<string> {
        return this.yMap().keys();
    }

    observe(listener: (response: {
        name: "create" | "update" | "delete",
        snapshot: any,
    }) => void): { unobserve: () => void } {
        const observer = async (tEvent: YMapEvent<any>) => {
            for (const key of Array.from(tEvent.keys.keys())) {
                switch (tEvent?.keys?.get(key)?.action) {
                    case "add":
                        listener({
                            name: "create",
                            snapshot: this.yMap().get(key)
                        });
                        break;
                    case "delete":
                        listener({
                            name: "delete",
                            snapshot: {id: key}
                        });
                        break;
                    case "update":
                        const d = this.yMap().get(key);
                        const od = tEvent?.keys?.get(key)?.oldValue;
                        if (!Array.isArray(d) && JSON.stringify(d) !== JSON.stringify(od)) {
                            listener({
                                name: "update",
                                snapshot: d
                            });
                        }
                        break;
                }
            }
        }
        this.yMap()?.observe(observer);
        return {
            unobserve: () => {
                this.yMap()?.unobserve(observer);
            }
        }
    }

    stop() {
        this.close();
    }

    close() {
        this.destroy();
    }

    unobserve(fn: (...args: any) => void) {
        this?.yMap()?.unobserve(fn);
    }
}
