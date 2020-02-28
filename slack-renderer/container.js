import _ from 'lodash';

export class SlackContainer {
  constructor(subClient, handlerRegistry, response_url, stateful) {
    this.handlerRegistry = handlerRegistry;
    this.subClient = subClient;
    this.stateful = stateful;

    this.blocks = [];
    if (this.stateful) {
      this.emitter = new EventEmitter();
      this.response_url = response_url;

      this.subClient.on("message", (channel, message) => {
        if (this.handlerRegistry[channel]) {
          const msg = JSON.parse(message);
          this.response_url = msg.response_url;

          this.handlerRegistry[channel](msg);
        }
      });

      this.lastCommited = null;
    }
  }

  unsubscribeFromAction = uuid => {
    this.stateful && this.subClient.unsubscribe(uuid);
  };

  subscribeToNewActionId = uuid => {
    this.stateful && this.subClient.subscribe(uuid);
  };

  appendChild = child => {
    this.blocks.push(child);

    setImmediate(this.onCommited, 0);
  };

  removeChild = child => {
    const index = this.blocks.indexOf(child);

    this.blocks.splice(index, 1);

    setImmediate(this.onCommited, 0);
  };

  insertBefore = (child, beforeChild) => {
    const index = this.blocks.indexOf(beforeChild);

    this.blocks.splice(index, 0, child);
    setImmediate(this.onCommited, 0);
  };

  onCommited = () => {
    const nextCommit = this.render();
    if (!_.isEqual(this.lastCommited, nextCommit)) {
      this.stateful && this.emitter.emit("commit", nextCommit);
      this.lastCommited = nextCommit;
    }
  };
  render = () => {
    return this.blocks.map(x => x.render());
  };
}
