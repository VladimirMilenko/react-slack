export class Child {
  constructor(props, root, type) {
    this.props = props;
    this.__root = root;
    this.__type = type;
  }
  onCommit() {
    this.__root.onCommited();
  }
}
