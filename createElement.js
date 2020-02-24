class Child {
  constructor(props, root, type) {
    this.props = props;
    this.__root = root;
    this.__type = type;
  }
  onCommit() {
    this.__root.onCommited();
  }
}

export class Text extends Child {
  constructor(text, root) {
    super(null, root, "TEXT");
    this.text = text;
  }
  setText(text) {
    this.text = text;
  }
  render() {
    return {
      type: "plain_text",
      text: this.text
    };
  }
}

class Datepicker extends Child {
  constructor(props, root) {
    super(props, root, "DATEPICKER");

    this.onChange = null;
    this.value = props.value || undefined;
    this.placeholder = props.placeholder;
    this.initialDate = props.initialDate || undefined;
  }

  render() {
    const { value, placeholder, initialDate, __actionId } = this;

    return {
      type: "datepicker",
      placeholder: placeholder ? new Text(this.placeholder).render() : undefined,
      action_id: this.__actionId,
      initial_date: value ? value : initialDate ? initialDate : undefined
    };
  }
}

class Button extends Child {
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

class Actions extends Child {
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

class Context extends Child {
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

class Markdown extends Child {
  constructor(props, root) {
    super(props, root, "MARKDOWN");

    this.children = [];
  }
  appendChild(child) {
    this.children.push(child);
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
    return {
      type: "mrkdwn",
      text: this.children.map(x => x.text).join("")
    };
  }
}

class Divider extends Child {
  constructor(props, root) {
    super(props, root, "DIVIDER");

    this.children = [];
  }
  appendChild(child) {}
  removeChild(child) {}
  render() {
    return {
      type: "divider"
    };
  }
}

class Section extends Child {
  constructor(props, root) {
    super(props, root, "SECTION");

    this.fields = null;
    this.accessory = null;
    this.text = null;
  }
  appendChild(child) {
    switch (child.__type) {
      case "SECTION_TEXT":
        this.text = child;
        break;
      case "SECTION_FIELDS":
        this.fields = child;
        break;
      case "SECTION_ACCESSORY":
        this.accessory = child;
        break;
      default:
        this.fields.push(child);
    }
  }
  removeChild(child) {
    switch (child.__type) {
      case "SECTION_TEXT":
        this.text = null;
        break;
      case "SECTION_FIELDS":
        this.fields = null;
        break;
      case "SECTION_ACCESSORY":
        this.accessory = null;
        break;
      default:
        const index = this.children.indexOf(child);
        this.fields.splice(index, 1);
        break;
    }
  }
  insertBefore(child, beforeChild) {
    this.appendChild(child);
  }
  render() {
    return {
      type: "section",
      text: this.text ? this.text.render() : undefined,
      fields: this.fields ? this.fields.render() : undefined,
      accessory: this.accessory ? this.accessory.render() : undefined
    };
  }
}

class SectionText extends Child {
  constructor(props, root) {
    super(props, root, "SECTION_TEXT");
    this.children = [];
  }
  appendChild(child) {
    this.children.push(child);
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
  render = () => {
    return {
      type: this.children.some(x => x.__type === "MARKDOWN")
        ? "mrkdwn"
        : "plain_text",
      text: this.children
        .map(x => x.render())
        .map(x => x.text)
        .join("")
    };
  };
}

class SectionFields extends Child {
  constructor(props, root) {
    super(props, root, "SECTION_FIELDS");
    this.children = [];
  }
  appendChild(child) {
    this.children.push(child);
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
  render = () => {
    return this.children.map(x => x.render());
  };
}

class SectionAccessory extends Child {
  constructor(props, root) {
    super(props, root, "SECTION_ACCESSORY");
    this.children = [];
  }
  appendChild(child) {
    this.children.push(child);
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
  render = () => {
    if (this.children.length > 1) {
      throw new Error("Accessory only accepts one child");
    }
    if (!this.children || this.children.length === 0) {
      return null;
    }
    return this.children[0].render();
  };
}

export const createElement = (type, props, rootContainerInstance) => {
  const LIB = {
    BUTTON: () => new Button(props, rootContainerInstance),
    ACTIONS: () => new Actions(props, rootContainerInstance),
    CONTEXT: () => new Context(props, rootContainerInstance),
    MARKDOWN: () => new Markdown(props, rootContainerInstance),
    DIVIDER: () => new Divider(props, rootContainerInstance),
    SECTION: () => new Section(props, rootContainerInstance),
    SECTION_TEXT: () => new SectionText(props, rootContainerInstance),
    SECTION_FIELDS: () => new SectionFields(props, rootContainerInstance),
    SECTION_ACCESSORY: () => new SectionAccessory(props, rootContainerInstance),
    DATEPICKER: () => new Datepicker(props, rootContainerInstance)
  };

  return LIB[type]();
};
