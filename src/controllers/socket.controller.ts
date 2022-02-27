import { BFastConfig } from "../conf";

//@ts-ignore
import { io } from "socket.io-client";
import { getConfig } from "../bfast";

export class SocketController {
  public readonly socket: any;

  constructor(
    private readonly eventName: string,
    appName = BFastConfig.DEFAULT_APP,
    onConnect?: Function,
    onDisconnect?: Function
  ) {
    const namespace =
      String(eventName)[0] === "/" ? eventName : "/" + eventName;
    const url = namespace.trim().startsWith("/v2/__")
      ? getConfig().databaseURL(appName, namespace)
      : getConfig().functionsURL(namespace, appName);
    this.socket = io(url, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      transports: ["websocket"]
    });
    if (onConnect) this.socket.on("connect", onConnect);
    if (onDisconnect) this.socket.on("disconnect", onDisconnect);
    this.open();
  }

  /**
   *
   * @param request {
   *     auth: any, // your auth data
   *     body: any // your data must be passed in this field
   * }
   */
  emit(request: { auth?: any; body: any }): void {
    if (typeof request === "object" && request.body !== undefined) {
      this.socket.emit(this.eventName, request);
    } else {
      throw "Please provide a request object with at least a body property `{ body: any }`";
    }
  }

  /**
   * add listener on this socket
   * @param handler {Function} example `listener((response)=>console.log(response.body))`
   */
  listener(handler: (response: { body: any }) => any): void {
    if (typeof handler === "function") {
      this.socket.on(this.eventName, handler);
    } else {
      throw "Function required";
    }
  }

  close(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  open(): void {
    if (this.socket.disconnected) {
      this.socket.open();
    }
  }
}
