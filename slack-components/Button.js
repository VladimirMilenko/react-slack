import { Child } from './SlackBase';
import { Text } from './Text';


export class Button extends Child {
  constructor(props, root) {
    super(props, root, "BUTTON");

    this.children = [];

    this.onClick = props.onClick;
  }
  appendChild(child) {
    if (child.__type === "TEXT") {
      this.children.push(child);
    }
  }
  removeChild(child) {
    const index = this.children.indexOf(child);
    this.children.splice(index, 1);
  }

  insertBefore(child, beforeChild) {
    const index = this.children.indexOf(beforeChild);
    if (index === 0) {
      this.children.unshift(child);
    } else {
      this.children.splice(index - 1, 0, child);
    }
  }

  render() {
    const { style, value, confirm } = this;

    return {
      type: "button",
      text: new Text(this.children.map(x => x.text).join("")).render(),
      action_id: this.__actionId,
      value,
      style,
      confirm
    };
  }
}
