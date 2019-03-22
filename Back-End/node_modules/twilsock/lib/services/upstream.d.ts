import { Configuration } from '../configuration';
import { PacketInterface } from '../packetinterface';
import { TwilsockImpl } from './../twilsock';
declare type Headers = {
    [id: string]: string;
};
interface Result {
    status: {
        code: number;
        status: string;
    };
    headers: Headers;
    body?: any;
}
declare class Upstream {
    private readonly config;
    private readonly transport;
    private readonly pendingMessages;
    private readonly twilsock;
    constructor(transport: PacketInterface, twilsock: TwilsockImpl, config: Configuration);
    saveMessage(message: any): Promise<Result>;
    sendPendingMessages(): void;
    rejectPendingMessages(): void;
    actualSend(message: any): Promise<Result>;
    /**
     * Send an upstream message
     * @param {Twilsock#Message} message Message structure with header, body and remote address
     * @returns {Promise<Result>} Result from remote side
     */
    send(method: string, url: string, headers?: Headers, body?: any): Promise<Result>;
}
export { Headers, Result, Upstream };
