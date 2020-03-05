import { Child, Root } from './SlackBase';
import { Text } from './Text';
import { getFakeRoot } from '../utils';

type ButtonChildren = Text;
type ButtonStyle = 'primary' | 'danger' | undefined;

export interface ButtonProps {
  style?: ButtonStyle;
  onClick?: (event: Object) => void;
  value?: string;
}

export class Button extends Child {
  children: Array<ButtonChildren>;
  onClick?: (event: Object) => void;
  style: ButtonStyle;
  value?: string;
  __actionId?: string;

  constructor(props: ButtonProps, root: Root) {
    super(props, root, 'BUTTON');

    this.children = [];
    this.style = props.style;
    this.value = props.value;
    this.onClick = props.onClick;
  }
  appendChild(child: ButtonChildren) {
    if (child.__type === 'TEXT') {
      this.children.push(child);
    }
  }
  removeChild(child: ButtonChildren) {
    const index = this.children.indexOf(child);
    this.children.splice(index, 1);
  }

  setActionId(actionId: string) {
    this.__actionId = actionId;
  }

  insertBefore(child: ButtonChildren, beforeChild: ButtonChildren) {
    const index = this.children.indexOf(beforeChild);
    if (index === 0) {
      this.children.unshift(child);
    } else {
      this.children.splice(index - 1, 0, child);
    }
  }

  render() {
    const { style, value } = this;

    return {
      type: 'button',
      text: new Text(
        this.children.map(x => x.text).join(''),
        getFakeRoot()
      ).render(),
      action_id: this.__actionId,
      value,
      style,
    };
  }
}
