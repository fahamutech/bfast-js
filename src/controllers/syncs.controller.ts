import {DatabaseController} from "./database.controller";
import {SyncChangesController} from "./sync-changes.controller";
import {BulkController} from "./bulk.controller";
import {CacheAdapter} from "../adapters/cache.adapter";
import {BFastConfig} from "../conf";
import * as Y from "yjs";
import {isBrowser, isElectron, isWebWorker} from "../utils/platform.util";
import {IndexeddbPersistence} from "y-indexeddb";
import {WebrtcProvider} from "y-webrtc";
import {WebsocketProvider} from "y-websocket";
import {YMap} from "yjs/dist/src/types/YMap";
import {observe, set} from "../utils/syncs.util";

export class SyncsController {
    private static yDoc: Y.Doc | undefined;
    private static yMap: YMap<any> | undefined;
    private static yDocPersistence: IndexeddbPersistence | undefined;
    private static yDocWebRtc: WebrtcProvider | undefined;
    private static yDocSocket: WebsocketProvider | undefined;
    private static instance: SyncsController | undefined;

    private constructor(
        private readonly treeName: string,
        private readonly databaseController: DatabaseController,
        private readonly bulkController: BulkController) {
    }

    static getInstance(appName: string,
                       treeName: string,
                       projectId: string,
                       bulkController: BulkController,
                       cacheAdapter: CacheAdapter,
                       databaseController: DatabaseController): SyncsController {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new SyncsController(
            treeName,
            databaseController,
            bulkController
        );
        const room = BFastConfig.getInstance().credential(appName).projectId + '_' + treeName;
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
        this.yMap = this.yDoc.getMap(treeName);
        this.yMap.observe(arg0 => {
            observe(
                arg0,
                projectId,
                treeName,
                this.yMap,
                cacheAdapter
            );
        })
        return this.instance;
    }

    changes(): SyncChangesController {
        if (!SyncsController.yMap) {
            throw {message: 'syncs destroyed initialize again'}
        }
        return new SyncChangesController(
            () => {
                if (!SyncsController.yMap) {
                    throw {message: 'syncs destroyed, initialize again'}
                }
                return SyncsController?.yMap
            },
            () => this.close()
        );
    }

    close() {
        try {
            SyncsController?.yDocWebRtc?.disconnect();
            SyncsController?.yDocSocket?.disconnectBc();
            // SyncsController?.yDocPersistence?.destroy();
            // SyncsController?.yDoc?.destroy();
            try {
                SyncsController?.yDocWebRtc?.destroy();
                SyncsController?.yDocSocket?.destroy();
            } catch (e) {
            }
            SyncsController.yDoc = undefined;
            SyncsController.instance = undefined;
            SyncsController.yDocWebRtc = undefined;
            SyncsController.yDocSocket = undefined;
            SyncsController.yDocPersistence = undefined;
            SyncsController.yMap = undefined;
        } catch (e) {
            console.log(e, '**************');
        }
    }

    async download(): Promise<any[]> {
        const vs = SyncsController?.yMap?.values();
        const docs = Array.from(vs ? vs : []).map(y => {
            if (y._id) {
                y.id = y._id;
                delete y._id;
            }
            if (!y.hasOwnProperty('createdAt')) {
                y.createdAt = new Date().toISOString();
            }
            if (!y.hasOwnProperty('updatedAt')) {
                y.updatedAt = new Date().toISOString();
            }
            return y;
        });
        await this.bulkController.update(
            this.treeName,
            docs.filter(t => !!t.id).map(x => {
                return {
                    query: {
                        id: x.id,
                        upsert: true,
                    },
                    update: {
                        $set: x
                    }
                }
            })
        ).commit({useMasterKey: true});
        return docs;
    }

    async upload(): Promise<any[]> {
        let pData: any[] = await this.databaseController.getAll(undefined, {useMasterKey: true});
        if (!pData) {
            pData = [];
        }
        for (const data of pData) {
            set(data, SyncsController?.yMap);
        }
        return pData;
    }

}
