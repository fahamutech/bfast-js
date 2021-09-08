import {SocketController} from "./socket.controller";
import {DatabaseChangesModel} from "../models/DatabaseChangesModel";

export class DatabaseChangesController {
    constructor(private socketController: SocketController) {
    }

    addListener(handler: (response: { body: DatabaseChangesModel }) => any) {
        this.socketController.listener(handler);
    }

    close() {
        this.socketController.close()
    }

    open() {
        this.socketController.open()
    }
}
