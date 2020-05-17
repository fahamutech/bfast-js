export interface RealTimeAdapter {

    emit(data: { auth: any, payload: any }): void;

    listener(handler: (event: { auth: any; payload: any }) => any): void;

    close(): void;

    open(): void;
}
