import * as Y from 'yjs';
import {YMapEvent} from 'yjs';
import {WebsocketProvider} from "y-websocket";
import {IndexeddbPersistence} from 'y-indexeddb';
import {YMap} from 'yjs/dist/src/types/YMap';
import {SocketController} from "./socket.controller";
import {WebrtcProvider} from "y-webrtc";
import {BFastConfig} from "../conf";
import {isBrowser, isElectron, isWebWorker} from "../index";
import {DatabaseController} from "./database.controller";

export class SyncChangesController {
    private yDoc: Y.Doc | undefined;
    private readonly yMap: YMap<any>;
    private readonly yDocPersistence;
    private readonly yDocWebRtc;
    private readonly yDocSocket;

    constructor(private readonly appName: string,
                private readonly name: string,
                private readonly databaseController: DatabaseController,
                private readonly socketController: SocketController) {
        const room = BFastConfig.getInstance().credential(appName).projectId + '_' + name;
        this.yDoc = new Y.Doc();
        if (isElectron || isBrowser || isWebWorker) {
            this.yDocPersistence = new IndexeddbPersistence(room, this.yDoc);
        }
        this.yDocWebRtc = new WebrtcProvider(room, this.yDoc);
        // `wss://demos.yjs.dev`
        this.yDocSocket = new WebsocketProvider(
            'wss://demos.yjs.dev',
            room,
            this.yDoc
        );
        this.yMap = this.yDoc.getMap(name);
    }

    async snapshot(cids = false): Promise<any | string> {
        return this.databaseController.getAll();
    }

    async load(): Promise<boolean> {
        let pData: any[] = await this.databaseController.getAll(undefined, {useMasterKey: true});
        if (!pData) {
            pData = [];
        }
        for (const data of pData) {
            this.set(data);
        }
        return true;
    }

    get size() {
        return this.yMap.size;
    };

    get(key: string) {
        return this.yMap.get(key);
    }

    set(value: { [key: string]: any }): void {
        if (value.id) {
            value._id = value.id;
            delete value.id;
        }
        if (value._created_at) {
            value.createdAt = value._created_at;
            delete value._created_at;
        }
        if (value._updated_at) {
            value.updatedAt = value._updated_at;
            delete value._updated_at;
        }
        if (typeof value?.createdAt === "object") {
            value.createdAt = '2020-09-01';
        }
        if (typeof value?.updatedAt === "object") {
            value.updatedAt = '2020-09-01';
        }
        if (!value.hasOwnProperty('createdAt')) {
            value.createdAt = new Date().toISOString();
        }
        if (!value.hasOwnProperty('updatedAt')) {
            value.updatedAt = new Date().toISOString();
        }
        if (value.hasOwnProperty('_id')) {
            this.yMap.set(value._id, value);
        } else {
            throw {message: 'please doc must have id/_id field', data: JSON.stringify(value, null, 4)};
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
    }) => void): { unobserve: () => void } {
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
            unobserve: () => {
                this.yMap?.unobserve(observer);
            }
        }
    }

    // status(fn: (data: { body: { info?: any, error?: any } }) => void) {
    //     this.socketController.listener(fn);
    // }

    stop() {
        this.close();
    }

    close() {
        try {
            this.socketController?.close();
            this.yDocWebRtc?.destroy();
            this.yDocSocket?.destroy();
            this.yDocPersistence?.destroy();
            this.yDoc?.destroy();
            this.yDoc = undefined;
        } catch (e) {
            console.log(e);
        }
    }

    unobserve(fn: (...args: any) => void) {
        this.yMap.unobserve(fn);
    }
}
