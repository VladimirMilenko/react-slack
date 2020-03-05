import { Child, Root } from './SlackBase';
import { Text } from './Text';
import { Markdown } from './Markdown';
import { getFakeRoot } from 'utils';

type ContextChildren = Text | Markdown;

export class Context extends Child {
  elements: Array<ContextChildren>;

  constructor(props: any, root: Root) {
    super(props, root, 'CONTEXT');

    this.elements = [];
  }
  appendChild(child: ContextChildren) {
    this.elements.push(child);
  }
  removeChild(child: ContextChildren) {
    const index = this.elements.indexOf(child);
    this.elements.splice(index, 1);
  }
  insertBefore(child: ContextChildren, beforeChild: ContextChildren) {
    const index = this.elements.indexOf(beforeChild);
    if (index === 0) {
      this.elements.unshift(child);
    } else {
      this.elements.splice(index - 1, 0, child);
    }
  }
  render() {
    return {
      type: 'context',
      elements: this.elements.map(x => {
        if (x instanceof Markdown) {
          return x.render();
        }
        if (x.__type === 'TEXT') {
          return new Text(x.text, getFakeRoot()).render();
        }
        return null;
      }),
    };
  }
}
