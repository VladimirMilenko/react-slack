/// <reference types="node" />
import { RedisClient } from 'redis';
import { EventEmitter } from 'events';
declare type HandlerRegistry = {
    [key: string]: Function;
};
export declare class RedisSlackContainer {
    handlerRegistry: HandlerRegistry;
    subClient: RedisClient;
    emitter: EventEmitter;
    blocks: Array<Object>;
    lastCommited: Object | null;
    constructor(subClient: RedisClient, handlerRegistry: HandlerRegistry);
    unsubscribeFromAction: (uuid: string) => void;
    subscribeToNewActionId: (uuid: string) => void;
    appendChild: (child: Object) => void;
    removeChild: (child: Object) => void;
    insertBefore: (child: Object, beforeChild: Object) => void;
    onCommited: () => void;
    render: () => any[];
}
export {};
