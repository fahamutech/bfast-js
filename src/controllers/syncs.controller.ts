import {DatabaseController} from "./database.controller";
import {SyncChangesController} from "./sync-changes.controller";
import {BulkController} from "./bulk.controller";
import {CacheAdapter} from "../adapters/cache.adapter";
import {BFastConfig} from "../conf";
import * as Y from "yjs";
import {Doc} from "yjs";
import {isBrowser, isElectron, isWebWorker} from "../utils/platform.util";
import {IndexeddbPersistence} from "y-indexeddb";
import {WebsocketProvider} from "y-websocket";
import {YMap} from "yjs/dist/src/types/YMap";
import {set} from "../utils/syncs.util";
// @ts-ignore
import * as sha1 from "js-sha1";

export class SyncsController {
    private static instance: { [key: string]: SyncsController } = {};
    private static fields: {
        [key: string]: {
            yDoc: Y.Doc; yMap: YMap<any>; yDocPersistence: IndexeddbPersistence; yDocSocket: WebsocketProvider;
        }
    } = {};

    private constructor(
        private readonly treeName: string,
        private readonly projectId: string,
        private readonly cacheAdapter: CacheAdapter,
        private readonly databaseController: DatabaseController,
        private readonly bulkController: BulkController) {
    }

    static getInstance(
        appName: string,
        treeName: string,
        projectId: string,
        bulkController: BulkController,
        cacheAdapter: CacheAdapter,
        databaseController: DatabaseController,
        synced?: (() => void)
    ): SyncsController {
        if (this.instance[treeName] && this.fields[treeName]) {
            if (typeof synced === "function") {
                synced();
            }
            return <SyncsController>this.instance[treeName];
        }
        this.instance[treeName] = new SyncsController(
            treeName,
            projectId,
            cacheAdapter,
            databaseController,
            bulkController
        );
        const r = BFastConfig.getInstance().credential(appName).projectId + '/' + treeName + '/' + appName;
        const room = sha1(r);
        this.fields[treeName] = {} as any;
        this.fields[treeName].yDoc = new Y.Doc();
        if (isElectron || isBrowser || isWebWorker) {
            this.fields[treeName].yDocPersistence = new IndexeddbPersistence(room, this.fields[treeName].yDoc);
            this.fields[treeName].yDocPersistence.once('synced', () => {
                this.fields[treeName].yDocSocket = new WebsocketProvider(
                    'wss://yjs.bfast.fahamutech.com',
                    room,
                    <Doc>this.fields[treeName].yDoc
                );
                if (typeof synced === "function") {
                    synced();
                }
            });
        } else {
            console.log('not in browser');
            this.fields[treeName].yDocSocket = new WebsocketProvider(
                'wss://yjs.bfast.fahamutech.com',
                room,
                this.fields[treeName].yDoc
            );
        }
        this.fields[treeName].yMap = this.fields[treeName].yDoc.getMap(treeName);
        return this.instance[treeName];
    }

    changes(): SyncChangesController {
        if (!SyncsController.fields[this.treeName].yMap) {
            throw {message: 'syncs destroyed initialize again'}
        }
        return new SyncChangesController(
            this.projectId,
            this.treeName,
            this.cacheAdapter,
            () => {
                if (!SyncsController.fields[this.treeName].yMap) {
                    throw {message: 'syncs destroyed, initialize again'}
                }
                return <YMap<any>>SyncsController?.fields[this.treeName].yMap
            },
            () => this.close()
        );
    }

    close() {
        try {
            try {
                SyncsController.fields[this.treeName].yDoc.destroy();
            } catch (e) {
                console.log(e, 'destroy ydoc');
            }
            try {
                if (SyncsController.fields[this.treeName].yMap.doc) {
                    SyncsController.fields[this.treeName].yMap.doc?.destroy()
                }
            } catch (e) {
                console.log(e, 'destroy ydoc');
            }
            try {
                SyncsController?.fields[this.treeName].yDocSocket.destroy();
            } catch (e) {
                console.log(e, 'destroy socket');
            }
            try {
                SyncsController?.fields[this.treeName].yDocPersistence?.destroy();
            } catch (e) {
                console.log(e, 'destroy persistence');
            }
            delete SyncsController.instance[this.treeName];
            delete SyncsController.fields[this.treeName];
        } catch (e) {
            console.log(e, '**************');
        } finally {
        }
    }

    async download(): Promise<any[]> {
        const vs = SyncsController?.fields[this.treeName].yMap?.values();
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
            set(data, SyncsController?.fields[this.treeName].yMap);
        }
        return pData;
    }

}
