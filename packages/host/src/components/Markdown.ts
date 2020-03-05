import { Child, Root } from './SlackBase';
import { Text } from './Text';

type MarkdownChildren = Text;

export class Markdown extends Child {
  children: Array<MarkdownChildren>;

  constructor(props: Object, root: Root) {
    super(props, root, 'MARKDOWN');

    this.children = [];
  }
  appendChild(child: MarkdownChildren) {
    this.children.push(child);
  }
  removeChild(child: MarkdownChildren) {
    const index = this.children.indexOf(child);
    this.children.splice(index, 1);
  }
  insertBefore(child: MarkdownChildren, beforeChild: MarkdownChildren) {
    const index = this.children.indexOf(beforeChild);
    if (index === 0) {
      this.children.unshift(child);
    } else {
      this.children.splice(index - 1, 0, child);
    }
  }
  render() {
    return {
      type: 'mrkdwn',
      text: this.children.map(x => x.text).join(''),
    };
  }
}
