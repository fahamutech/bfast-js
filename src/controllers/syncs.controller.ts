import {DatabaseController} from "./database.controller";
import {SnapshotModel} from "../models/snapshot.model";
import {SyncDocController} from "./sync-doc.controller";
import {SocketController} from "./socket.controller";
import {BFastConfig} from "../conf";

export class SyncsController {

    constructor(private readonly name: string,
                private readonly databaseController: DatabaseController,
                private readonly appName: string) {
    }

    async snapshot(cids = false): Promise< any | string> {
        return this.databaseController.getAll();
    }

    // async setSnapshot(datas: { [key: string]: any }[], cids = false): Promise<SnapshotModel | string> {
    //     // const snapS: SnapshotModel = {
    //     //     _id: this.name,
    //     //     createdAt: 'n/a',
    //     //     updatedAt: 'n/a',
    //     //     docs: datas.reduce((a, b) => {
    //     //         if (!b.hasOwnProperty('id')) {
    //     //             throw {message: 'all datas must contain id field', reason: JSON.stringify(b)};
    //     //         }
    //     //         a[b.id] = b;
    //     //         return a;
    //     //     }, {})
    //     // }
    //     return this.databaseController.query()
    //         .byId(snapS._id)
    //         .cids(cids)
    //         .updateBuilder()
    //         .upsert(true)
    //         .doc(snapS)
    //         .update();
    // }

    doc(onConnect: () => void, onDisconnect: () => void): SyncDocController {
        const applicationId = BFastConfig.getInstance().credential(this.appName).applicationId;
        const projectId = BFastConfig.getInstance().credential(this.appName).projectId;
        const masterKey = BFastConfig.getInstance().credential(this.appName).appPassword;
        const socketController = new SocketController(
            '/v2/__syncs__',
            this.appName,
            () => {
                if (onConnect && typeof onConnect === "function") {
                    onConnect();
                }
                socketController.emit({
                    auth: {
                        applicationId: applicationId,
                        topic: `${projectId}_${this.name}`,
                        masterKey: masterKey
                    },
                    body: {
                        domain: this.name
                    }
                });
            },
            onDisconnect
        );
        return new SyncDocController(
            this.appName,
            this.name,
            socketController
        );
    }

}
