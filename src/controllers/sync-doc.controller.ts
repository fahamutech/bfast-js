import * as Y from 'yjs';
import {WebsocketProvider} from "y-websocket";
import {IndexeddbPersistence} from 'y-indexeddb';
import {YMap} from 'yjs/dist/src/types/YMap';
import {SocketController} from "./socket.controller";
import {WebrtcProvider} from "y-webrtc";
import {BFastConfig} from "../conf";
import {YMapEvent} from "yjs";

export class SyncDocController {
    private yDoc: Y.Doc | undefined;
    private readonly yMap: YMap<any>

    constructor(private readonly appName: string,
                private readonly name: string,
                private readonly socketController: SocketController) {
        const room = BFastConfig.getInstance().credential(appName).projectId + '_' + name;
        this.yDoc = new Y.Doc();
        new IndexeddbPersistence(room, this.yDoc);
        new WebrtcProvider(room, this.yDoc
            // {
            // signaling: [
            //     'wss://stun.l.google.com',
            //     'wss://stun1.l.google.com',
            //     'wss://stun2.l.google.com',
            //     'wss://stun3.l.google.com',
            //     'wss://stun4.l.google.com',
            // ]
            // }
        );
        // `wss://demos.yjs.dev`
        new WebsocketProvider(
            'wss://demos.yjs.dev',
            room,
            this.yDoc
        );
        this.yMap = this.yDoc.getMap(name);
    }

    get size() {
        return this.yMap.size;
    };

    get(key: string) {
        return this.yMap.get(key);
    }

    set(value: { [key: string]: any }): void {
        if (value.hasOwnProperty('id')) {
            this.yMap.set(value.id, value);
        } else {
            throw {message: 'please doc must have id field'}
        }
    }

    delete(key: string): void {
        this.yMap.delete(key)
    }

    has(key: string): boolean {
        return this.yMap.has(key);
    }

    toJSON(): { [key: string]: any } {
        return this.yMap.toJSON();
    }

    entries(): IterableIterator<any> {
        return this.yMap.entries();
    }

    values(): IterableIterator<any> {
        return this.yMap.values();
    }

    keys(): IterableIterator<string> {
        return this.yMap.keys();
    }

    observe(listener: (response: {
        name: "create" | "update" | "delete",
        snapshot: any,
        // resumeToken: doc._id
    }) => void): { stop: () => void } {
        const observer = async (tEvent: YMapEvent<any>) => {
            for (const key of Array.from(tEvent.keys.keys())) {
                switch (tEvent?.keys?.get(key)?.action) {
                    case "add":
                        const doc = this.yMap.get(key);
                        if (doc._id) {
                            doc.id = doc._id;
                            delete doc._id;
                        }
                        listener({
                            name: "create",
                            snapshot: doc,
                            // resumeToken: doc._id
                        });
                        break;
                    case "delete":
                        listener({
                            name: "delete",
                            snapshot: {_id: key},
                            // resumeToken: key
                        });
                        break;
                    case "update":
                        const d = this.yMap.get(key);
                        const od = tEvent?.keys?.get(key)?.oldValue;
                        if (!Array.isArray(d) && JSON.stringify(d) !== JSON.stringify(od)) {
                            listener({
                                name: "update",
                                snapshot: d,
                                // resumeToken: d._id
                            });
                        }
                        break;
                }
            }
        }
        this.yMap.observe(observer);
        return {
            stop: () => {
                this.yMap.unobserve(observer);
            }
        }
    }

    onSnapshot(fn: (data: { body: { info?: any, error?: any } }) => void) {
        this.socketController.listener(fn);
    }

    stop() {
        this.socketController.close();
        this.yDoc?.destroy();
        this.yDoc = undefined;
    }

    close() {
        this.socketController.close();
        this.yDoc?.destroy();
        this.yDoc = undefined;
    }

    unobserve(fn: (...args: any) => void) {
        this.yMap.unobserve(fn);
    }
}
