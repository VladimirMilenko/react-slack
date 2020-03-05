import { Root, Child } from './SlackBase';
import { Button } from './Button';
import { Datepicker } from './DatePicker';
import { Markdown } from './Markdown';
import { Text } from './Text';

type SectionChild = SectionAccessory | SectionText | SectionFields;

export class Section extends Child {
  fields: SectionFields | null = null;
  accessory: SectionAccessory | null = null;
  text: SectionText | null = null;

  constructor(props: Object, root: Root) {
    super(props, root, 'SECTION');

    this.fields = null;
    this.accessory = null;
    this.text = null;
  }
  appendChild(child: SectionChild) {
    if (child instanceof SectionText) {
      this.text = child;
      return;
    }
    if (child instanceof SectionFields) {
      this.fields = child;
      return;
    }
    if (child instanceof SectionAccessory) {
      this.accessory = child;
      return;
    }

    throw new Error('Usupported type');
  }
  removeChild(child: SectionChild) {
    if (child instanceof SectionText) {
      this.text = null;
      return;
    }
    if (child instanceof SectionFields) {
      this.fields = null;
      return;
    }
    if (child instanceof SectionAccessory) {
      this.accessory = null;
      return;
    }

    throw new Error('Usupported type');
  }
  insertBefore(child: SectionChild) {
    this.appendChild(child);
  }
  render() {
    return {
      type: 'section',
      text: this.text ? this.text.render() : undefined,
      fields: this.fields ? this.fields.render() : undefined,
      accessory: this.accessory ? this.accessory.render() : undefined,
    };
  }
}

type TextChildren = Text | Markdown;

export class SectionText extends Child {
  children: Array<TextChildren> = [];

  constructor(props: Object, root: Root) {
    super(props, root, 'SECTION_TEXT');
    this.children = [];
  }
  appendChild(child: TextChildren) {
    this.children.push(child);
  }
  removeChild(child: TextChildren) {
    const index = this.children.indexOf(child);
    this.children.splice(index, 1);
  }
  insertBefore(child: TextChildren, beforeChild: TextChildren) {
    const index = this.children.indexOf(beforeChild);
    if (index === 0) {
      this.children.unshift(child);
    } else {
      this.children.splice(index - 1, 0, child);
    }
  }
  render = () => {
    return {
      type: this.children.some(x => x.__type === 'MARKDOWN')
        ? 'mrkdwn'
        : 'plain_text',
      text: this.children
        .map(x => x.render())
        .map(x => x.text)
        .join(''),
    };
  };
}

type FieldsChildren = Markdown | Text;

export class SectionFields extends Child {
  children: Array<FieldsChildren> = [];

  constructor(props: Object, root: Root) {
    super(props, root, 'SECTION_FIELDS');
    this.children = [];
  }
  appendChild(child: FieldsChildren) {
    this.children.push(child);
  }
  removeChild(child: FieldsChildren) {
    const index = this.children.indexOf(child);
    this.children.splice(index, 1);
  }
  insertBefore(child: FieldsChildren, beforeChild: FieldsChildren) {
    const index = this.children.indexOf(beforeChild);
    if (index === 0) {
      this.children.unshift(child);
    } else {
      this.children.splice(index - 1, 0, child);
    }
  }
  render = () => {
    return this.children.map(x => x.render());
  };
}

type AccessoryChildren = Button | Datepicker;

export class SectionAccessory extends Child {
  children: Array<AccessoryChildren> = [];

  constructor(props: Object, root: Root) {
    super(props, root, 'SECTION_ACCESSORY');
    this.children = [];
  }
  appendChild(child: AccessoryChildren) {
    this.children.push(child);
  }
  removeChild(child: AccessoryChildren) {
    const index = this.children.indexOf(child);
    this.children.splice(index, 1);
  }
  insertBefore(child: AccessoryChildren, beforeChild: AccessoryChildren) {
    const index = this.children.indexOf(beforeChild);
    if (index === 0) {
      this.children.unshift(child);
    } else {
      this.children.splice(index - 1, 0, child);
    }
  }
  render = () => {
    if (this.children.length > 1) {
      throw new Error('Accessory only accepts one child');
    }
    if (!this.children || this.children.length === 0) {
      return null;
    }
    return this.children[0].render();
  };
}
