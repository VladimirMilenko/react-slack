import { Child } from './SlackBase';

export class Actions extends Child {
  constructor(props, root) {
    super(props, root, "ACTIONS");

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
      type: "actions",
      elements: this.elements.map(x => x.render())
    };
  }
}
