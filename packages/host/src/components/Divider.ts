import { Child, Root } from './SlackBase';

export class Divider extends Child {
  children: never[];
  constructor(props: Object, root: Root) {
    super(props, root, 'DIVIDER');

    this.children = [];
  }
  appendChild() {}
  removeChild() {}
  render() {
    return {
      type: 'divider',
    };
  }
}
