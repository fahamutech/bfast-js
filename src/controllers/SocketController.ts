import {RealTimeAdapter} from "../core/RealTimeAdapter";
import * as io from 'socket.io-client';
import {BFastConfig} from "../conf";
import Socket = SocketIOClient.Socket;

export class SocketController implements RealTimeAdapter {
    public readonly socket: Socket;

    constructor(private readonly eventName: string) {
        this.socket = io(BFastConfig.getInstance().getCloudFunctionsUrl('/'), {
            autoConnect: true,
        });
    }

    emit(data: { auth: any; payload: any }): void {
        this.socket.emit(this.eventName, data);
    }

    listener(handler: (event: { auth: any; payload: any }) => any): void {
        this.socket.on(this.eventName, handler);
    }

    close(): void {
        this.socket.disconnect();
    }

    // onConnect(handler: (data: any) => any): void {
    //     this.socket.on('connect', handler);
    // }

    // onDisconnect(handler: (data: any) => any): void {
    //     this.socket.on('disconnect', handler);
    // }

}
