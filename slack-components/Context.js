import { Child } from './SlackBase';
import { Text } from './Text';
import { Markdown } from './Markdown';

export class Context extends Child {
  constructor(props, root) {
    super(props, root, "CONTEXT");

    this.elements = [];
  }
  appendChild(child) {
    this.elements.push(child);
  }
  removeChild(child) {
    const index = this.elements.indexOf(child);
    this.elements.splice(index, 1);
  }
  insertBefore(child, beforeChild) {
    const index = this.elements.indexOf(beforeChild);
    if (index === 0) {
      this.elements.unshift(child);
    } else {
      this.elements.splice(index - 1, 0, child);
    }
  }
  render() {
    return {
      type: "context",
      elements: this.elements.map(x => {
        if (x instanceof Markdown) {
          return x.render();
        }
        if (x.__type === "TEXT") {
          return new Text(x.text).render();
        }
      })
    };
  }
}
