import {SocketController} from './SocketController';
import {DatabaseChangesModel} from '../models/DatabaseChangesModel';

export class DatabaseChangesController {
  constructor(private socketController: SocketController) {
  }

  addListener(handler: (response: { body: DatabaseChangesModel }) => any): void {
    this.socketController.listener(handler);
  }

  close(): void {
    this.socketController.close();
  }

  open(): void {
    this.socketController.open();
  }
}
