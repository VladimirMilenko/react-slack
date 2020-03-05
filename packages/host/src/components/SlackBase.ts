export type Root = Object & { onCommited: () => void };

export class Child {
  public __type: string;
  __root: Root;
  props: any;

  constructor(props: any, root: Root, type: string) {
    this.props = props;
    this.__root = root;
    this.__type = type;
  }
  onCommit() {
    this.__root.onCommited();
  }
}
