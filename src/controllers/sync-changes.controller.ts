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
    private static yDoc: Y.Doc | undefined;
    private static yMap: YMap<any>;
    private static yDocPersistence: IndexeddbPersistence | undefined;
    private static yDocWebRtc: WebrtcProvider | undefined;
    private static yDocSocket: WebsocketProvider | undefined;
    private static instance: SyncChangesController | undefined;

    private constructor(
        private readonly databaseController: DatabaseController,
        private readonly socketController: SocketController
    ) {
    }

    static getInstance(appName: string,
                       name: string,
                       databaseController: DatabaseController,
                       socketController: SocketController): SyncChangesController {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new SyncChangesController(
            databaseController,
            socketController
        );
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
        return this.instance;
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
        return SyncChangesController?.yMap.size;
    };

    get(key: string) {
        return SyncChangesController?.yMap.get(key);
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
            SyncChangesController?.yMap.set(value._id, value);
        } else {
            throw {message: 'please doc must have id/_id field', data: JSON.stringify(value, null, 4)};
        }
    }

    delete(key: string): void {
        SyncChangesController?.yMap.delete(key)
    }

    has(key: string): boolean {
        return SyncChangesController?.yMap.has(key);
    }

    toJSON(): { [key: string]: any } {
        return SyncChangesController?.yMap.toJSON();
    }

    entries(): IterableIterator<any> {
        return SyncChangesController?.yMap.entries();
    }

    values(): IterableIterator<any> {
        return SyncChangesController?.yMap.values();
    }

    keys(): IterableIterator<string> {
        return SyncChangesController?.yMap.keys();
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
                        const doc = SyncChangesController?.yMap.get(key);
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
                        const d = SyncChangesController?.yMap.get(key);
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
        SyncChangesController.yMap.observe(observer);
        return {
            unobserve: () => {
                SyncChangesController?.yMap?.unobserve(observer);
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
            SyncChangesController?.yDocWebRtc?.disconnect();
            SyncChangesController?.yDocSocket?.disconnectBc();
            SyncChangesController?.yDocPersistence?.destroy();
            SyncChangesController?.yDoc?.destroy();

            try {
                SyncChangesController?.yDocWebRtc?.destroy();
                SyncChangesController?.yDocSocket?.destroy();
            } catch (e) {

            }

            SyncChangesController.yDoc = undefined;
            SyncChangesController.instance = undefined;
            SyncChangesController.yDocWebRtc = undefined;
            SyncChangesController.yDocSocket = undefined;
            SyncChangesController.yDocPersistence = undefined;
            SyncChangesController.yDoc = undefined;
            this.socketController?.close();
        } catch (e) {
            console.log(e, '**************');
        }
    }

    unobserve(fn: (...args: any) => void) {
        SyncChangesController?.yMap?.unobserve(fn);
    }
}
