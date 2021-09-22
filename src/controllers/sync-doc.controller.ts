import * as Y from 'yjs';
import {WebsocketProvider} from "y-websocket";
import {IndexeddbPersistence} from 'y-indexeddb';
import {YMap} from 'yjs/dist/src/types/YMap';
import {SocketController} from "./socket.controller";
import {WebrtcProvider} from "y-webrtc";

export class SyncDocController {
    private yDoc: Y.Doc | undefined;
    private readonly yMap: YMap<any>

    constructor(private readonly name: string,
                private readonly socketController: SocketController) {
        // if (!SyncDocController.yDoc){
            this.yDoc = new Y.Doc();
            new IndexeddbPersistence(name, this.yDoc);
            new WebrtcProvider(name, this.yDoc
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
            new WebsocketProvider(
                'wss://demos.yjs.dev',
                name,
                this.yDoc
            );
        // }
        this.yMap = this.yDoc.getMap(name);
    }

    get size() {
        return this.yMap.size;
    };

    get(key: string) {
        return this.yMap.get(key);
    }

    set(value: {[key: string]: any}): void {
        if (value.hasOwnProperty('id')){
            this.yMap.set(value.id, value);
        }else {
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

    observe(fn: (...args: any) => void) {
        this.yMap.observe(fn);
        return {
            stop: () => {
                this.yMap.unobserve(fn)
            }
        }
    }

    onSnapshot(fn: (data: { body: { info?: any, change?: any } }) => void) {
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
