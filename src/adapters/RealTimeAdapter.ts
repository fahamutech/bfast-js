export interface RealTimeAdapter {

    emit(request: { auth: any, body: any }): void;

    listener(handler: (response: { body: any }) => any): void;

    close(): void;

    open(): void;
}
