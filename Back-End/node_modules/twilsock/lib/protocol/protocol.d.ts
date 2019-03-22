declare namespace Protocol {
    type MessageType = 'notification' | 'message' | 'reply' | 'ping' | 'close' | 'init';
    type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'put_notification_ctx' | 'delete_notification_ctx';
    type Headers = {
        [id: string]: string;
    };
    type Params = {
        [id: string]: string;
    };
    interface Request {
        host: string;
        path: string;
        method: Method;
        headers: Headers;
        params: Params;
    }
    interface Address {
        method: Method;
        host: string;
        path: string;
        headers: Headers;
        params: Params;
    }
    interface Header {
        method: MessageType;
        id?: string;
        payload_type?: string;
        payload_size?: number;
        notification_ctx_id?: string;
        http_request?: Request;
    }
    interface Payload {
    }
    interface Context {
    }
    interface ClientMetadata {
        sdk: {
            ver: string;
            type: string;
        };
        application: {
            name: string;
            ver: string;
        };
        runtime: {
            platform: string;
            platform_ver: string;
            os: string;
            os_ver: string;
        };
    }
}
export { Protocol };
