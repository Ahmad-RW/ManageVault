/// <reference types="node" />
import { Channel } from './interfaces/channel';
import { EventEmitter } from 'events';
declare class WebSocketChannel extends EventEmitter implements Channel {
    private WebSocket;
    private readonly url;
    private socket;
    constructor(url: string);
    readonly isConnected: boolean;
    connect(): void;
    send(message: ArrayBuffer): void;
    close(): void;
}
export { WebSocketChannel };
