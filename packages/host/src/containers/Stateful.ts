import {isEqual} from 'lodash';
import { RedisClient } from 'redis';
import { EventEmitter } from 'events';

type HandlerRegistry = { [key: string]: Function };

export class RedisSlackContainer {
  handlerRegistry: HandlerRegistry;
  subClient: RedisClient;
  emitter: EventEmitter;
  blocks: Array<Object>;
  lastCommited: Object | null;

  constructor(subClient: RedisClient, handlerRegistry: HandlerRegistry) {
    this.handlerRegistry = handlerRegistry;
    this.subClient = subClient;

    this.blocks = [];
    this.emitter = new EventEmitter();

    this.subClient.on('message', (channel: string, message:any) => {
      if (this.handlerRegistry[channel]) {
        const msg = JSON.parse(message);

        this.handlerRegistry[channel](msg);
      }
    });

    this.lastCommited = null;
  }

  unsubscribeFromAction = (uuid: string) => {
    this.subClient.unsubscribe(uuid);
  };

  subscribeToNewActionId = (uuid: string) => {
    this.subClient.subscribe(uuid);
  };

  appendChild = (child: Object) => {
    this.blocks.push(child);

    setTimeout(this.onCommited, 0);
  };

  removeChild = (child: Object) => {
    const index = this.blocks.indexOf(child);

    this.blocks.splice(index, 1);

    setTimeout(this.onCommited, 0);
  };

  insertBefore = (child: Object, beforeChild: Object) => {
    const index = this.blocks.indexOf(beforeChild);

    this.blocks.splice(index, 0, child);
    setTimeout(this.onCommited, 0);
  };

  onCommited = () => {
    const nextCommit = this.render();
    if (!isEqual(this.lastCommited, nextCommit)) {
      this.emitter.emit('commit', nextCommit);
      this.lastCommited = nextCommit;
    }
  };
  render = () => {
    // @ts-ignore
    return this.blocks.map(x => x.render());
  };
}
