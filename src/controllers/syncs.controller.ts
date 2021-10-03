import {DatabaseController} from "./database.controller";
import {SyncChangesController} from "./sync-changes.controller";
import {SocketController} from "./socket.controller";
import {BFastConfig} from "../conf";

export class SyncsController {

    constructor(private readonly name: string,
                private readonly databaseController: DatabaseController,
                private readonly appName: string) {
    }

    changes(onConnect: () => void, onDisconnect: () => void): SyncChangesController {
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
        return new SyncChangesController(
            this.appName,
            this.name,
            this.databaseController,
            socketController
        );
    }

}
