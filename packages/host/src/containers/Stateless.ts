export class ObjectSlackContainer {
  blocks: Array<Object>;
  lastCommited: Object | null;

  constructor() {

    this.blocks = [];
    this.lastCommited = null;
  }

  unsubscribeFromAction = () => {
  };

  subscribeToNewActionId = () => {
  };

  appendChild = (child: Object) => {
    this.blocks.push(child);
  };

  removeChild = (child: Object) => {
    const index = this.blocks.indexOf(child);

    this.blocks.splice(index, 1);
  };

  insertBefore = (child: Object, beforeChild: Object) => {
    const index = this.blocks.indexOf(beforeChild);

    this.blocks.splice(index, 0, child);
  };

  onCommited = () => {
  };
  render = () => {
    // @ts-ignore
    return this.blocks.map(x => x.render());
  };
}
