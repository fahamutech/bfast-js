export interface RealTimeAdapter {
    // onConnect(handler: (data: any) => any): void;
    //
    // onDisconnect(handler: (data: any) => any): void;

    listener(handler: (event: { auth: any, payload: any }) => any): void;

    emit(data: { auth: any, payload: any }): void;

    close(): void
}
