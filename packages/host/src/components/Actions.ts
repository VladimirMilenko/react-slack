import { Child } from './SlackBase';
import { Datepicker } from './DatePicker';
import { Button } from './Button';

type ActionsChild = Datepicker | Button;

export class Actions extends Child {
  elements: Array<ActionsChild>;

  constructor(props: any, root: any) {
    super(props, root, 'ACTIONS');

    this.elements = [];
  }
  appendChild(child: ActionsChild) {
    this.elements.push(child);
  }
  removeChild(child: ActionsChild) {
    const index = this.elements.indexOf(child);
    this.elements.splice(index, 1);
  }

  insertBefore(child: ActionsChild, beforeChild: ActionsChild) {
    const index = this.elements.indexOf(beforeChild);
    if (index === 0) {
      this.elements.unshift(child);
    } else {
      this.elements.splice(index - 1, 0, child);
    }
  }
  render() {
    return {
      type: 'actions',
      elements: this.elements.map(x => x.render()),
    };
  }
}
