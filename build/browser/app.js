(function (react, _, ReactReconciler, uuid) {
  'use strict';

  react = react && react.hasOwnProperty('default') ? react['default'] : react;
  _ = _ && _.hasOwnProperty('default') ? _['default'] : _;
  ReactReconciler = ReactReconciler && ReactReconciler.hasOwnProperty('default') ? ReactReconciler['default'] : ReactReconciler;
  uuid = uuid && uuid.hasOwnProperty('default') ? uuid['default'] : uuid;

  class SlackContainer {
    constructor(subClient, handlerRegistry, response_url, stateful) {
      this.unsubscribeFromAction = uuid => {
        this.stateful && this.subClient.unsubscribe(uuid);
      };

      this.subscribeToNewActionId = uuid => {
        this.stateful && this.subClient.subscribe(uuid);
      };

      this.appendChild = child => {
        this.blocks.push(child);
        setImmediate(this.onCommited, 0);
      };

      this.removeChild = child => {
        const index = this.blocks.indexOf(child);
        this.blocks.splice(index, 1);
        setImmediate(this.onCommited, 0);
      };

      this.insertBefore = (child, beforeChild) => {
        const index = this.blocks.indexOf(beforeChild);
        this.blocks.splice(index, 0, child);
        setImmediate(this.onCommited, 0);
      };

      this.onCommited = () => {
        const nextCommit = this.render();

        if (!_.isEqual(this.lastCommited, nextCommit)) {
          this.stateful && this.emitter.emit("commit", nextCommit);
          this.lastCommited = nextCommit;
        }
      };

      this.render = () => {
        return this.blocks.map(x => x.render());
      };

      this.handlerRegistry = handlerRegistry;
      this.subClient = subClient;
      this.stateful = stateful;
      this.blocks = [];

      if (this.stateful) {
        this.emitter = new EventEmitter();
        this.response_url = response_url;
        this.subClient.on("message", (channel, message) => {
          if (this.handlerRegistry[channel]) {
            const msg = JSON.parse(message);
            this.response_url = msg.response_url;
            this.handlerRegistry[channel](msg);
          }
        });
        this.lastCommited = null;
      }
    }

  }

  var container = /*#__PURE__*/Object.freeze({
    __proto__: null,
    SlackContainer: SlackContainer
  });

  const Button = "BUTTON";
  const Actions = "ACTIONS";
  const Context = "CONTEXT";
  const Markdown = "MARKDOWN";
  const Divider = "DIVIDER";
  const Section = "SECTION";
  const SectionText = "SECTION_TEXT";
  const SectionFields = "SECTION_FIELDS";
  const SectionAccessory = "SECTION_ACCESSORY";
  const DatePicker = "DATEPICKER";

  var components = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Button: Button,
    Actions: Actions,
    Context: Context,
    Markdown: Markdown,
    Divider: Divider,
    Section: Section,
    SectionText: SectionText,
    SectionFields: SectionFields,
    SectionAccessory: SectionAccessory,
    DatePicker: DatePicker
  });

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

  class Actions$1 extends Child {
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

  class Text extends Child {
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

  class Button$1 extends Child {
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
      const {
        style,
        value,
        confirm
      } = this;
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

  class Markdown$1 extends Child {
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

  class Context$1 extends Child {
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
          if (x instanceof Markdown$1) {
            return x.render();
          }

          if (x.__type === "TEXT") {
            return new Text(x.text).render();
          }
        })
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
      const {
        value,
        placeholder,
        initialDate,
        __actionId
      } = this;
      return {
        type: "datepicker",
        placeholder: placeholder ? new Text(this.placeholder).render() : undefined,
        action_id: this.__actionId,
        initial_date: value ? value : initialDate ? initialDate : undefined
      };
    }

  }

  class Divider$1 extends Child {
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

  class Section$1 extends Child {
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
  class SectionText$1 extends Child {
    constructor(props, root) {
      super(props, root, "SECTION_TEXT");

      this.render = () => {
        return {
          type: this.children.some(x => x.__type === "MARKDOWN") ? "mrkdwn" : "plain_text",
          text: this.children.map(x => x.render()).map(x => x.text).join("")
        };
      };

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

  }
  class SectionFields$1 extends Child {
    constructor(props, root) {
      super(props, root, "SECTION_FIELDS");

      this.render = () => {
        return this.children.map(x => x.render());
      };

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

  }
  class SectionAccessory$1 extends Child {
    constructor(props, root) {
      super(props, root, "SECTION_ACCESSORY");

      this.render = () => {
        if (this.children.length > 1) {
          throw new Error("Accessory only accepts one child");
        }

        if (!this.children || this.children.length === 0) {
          return null;
        }

        return this.children[0].render();
      };

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

  }

  const createElement = (type, props, rootContainerInstance) => {
    const LIB = {
      BUTTON: () => new Button$1(props, rootContainerInstance),
      ACTIONS: () => new Actions$1(props, rootContainerInstance),
      CONTEXT: () => new Context$1(props, rootContainerInstance),
      MARKDOWN: () => new Markdown$1(props, rootContainerInstance),
      DIVIDER: () => new Divider$1(props, rootContainerInstance),
      SECTION: () => new Section$1(props, rootContainerInstance),
      SECTION_TEXT: () => new SectionText$1(props, rootContainerInstance),
      SECTION_FIELDS: () => new SectionFields$1(props, rootContainerInstance),
      SECTION_ACCESSORY: () => new SectionAccessory$1(props, rootContainerInstance),
      DATEPICKER: () => new Datepicker(props, rootContainerInstance)
    };
    return LIB[type]();
  };

  const hostConfig = {
    getRootHostContext(rootContainerInstance) {
      return {
        root: rootContainerInstance
      };
    },

    getChildHostContext(parentHostContext, type, rootContainerInstance) {
      return {};
    },

    getPublicInstance(instance) {
      return {};
    },

    prepareForCommit(containerInfo) {},

    resetAfterCommit(containerInfo) {},

    createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
      return createElement(type, props, rootContainerInstance);
    },

    createTextInstance(text, rootContainerInstance, hostContext, internalInstanceHandle) {
      return new Text(text, rootContainerInstance);
    },

    appendInitialChild(parentInstance, child) {
      parentInstance.appendChild(child);
    },

    finalizeInitialChildren(hostNode, type, props, rootContainerInstance, hostContext) {
      switch (type) {
        case Button:
          if (props.onClick) {
            if (hostNode.__root && hostNode.__root.handlerRegistry && hostNode.__actionId) {
              delete hostNode.__root.handlerRegistry[hostNode.__actionId];

              hostNode.__root.unsubscribeFromAction(hostNode.__actionId);
            }

            hostNode.__actionId = uuid();
            hostNode.onClick = props.onClick;
            hostNode.__root.handlerRegistry[hostNode.__actionId] = hostNode.onClick;

            if (hostNode.__root) {
              hostNode.__root.subscribeToNewActionId(hostNode.__actionId);
            }
          }

          return;

        case DatePicker:
          if (props.onChange) {
            if (hostNode.__root && hostNode.__root.handlerRegistry && hostNode.__actionId) {
              delete hostNode.__root.handlerRegistry[hostNode.__actionId];

              hostNode.__root.unsubscribeFromAction(hostNode.__actionId);
            }

            hostNode.__actionId = uuid();
            hostNode.onChange = props.onChange;
            hostNode.__root.handlerRegistry[hostNode.__actionId] = hostNode.onChange;

            if (hostNode.__root) {
              hostNode.__root.subscribeToNewActionId(hostNode.__actionId);
            }
          }

          return;

        default:
          return;
      }
    },

    prepareUpdate(domElement, type, oldProps, newProps, rootContainerInstance, hostContext) {
      const propKeys = new Set(Object.keys(newProps).concat(Object.keys(oldProps))).values();
      const payload = [];

      for (let key of propKeys) {
        if (key !== "children" && // text children are already handled
        oldProps[key] !== newProps[key]) {
          payload.push({
            [key]: newProps[key]
          });
        }
      }

      return payload;
    },

    shouldSetTextContent(type, props) {
      return false;
    },

    shouldDeprioritizeSubtree(type, props) {
      console.log("shouldDeprioritizeSubtree");
    },

    now: Date.now,
    isPrimaryRenderer: true,
    scheduleDeferredCallback: "",
    cancelDeferredCallback: "",
    // -------------------
    //     Mutation
    // -------------------
    supportsMutation: true,

    commitMount(domElement, type, newProps, internalInstanceHandle) {},

    commitUpdate(hostNode, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
      switch (type) {
        case Button:
          updatePayload.forEach(update => {
            Object.keys(update).forEach(key => {
              if (key === "onClick") {
                if (hostNode.__root && hostNode.__root.handlerRegistry) {
                  delete hostNode.__root.handlerRegistry[hostNode.__actionId];

                  hostNode.__root.unsubscribeFromAction(hostNode.__actionId);
                }

                hostNode.__actionId = uuid();
                hostNode.onClick = update[key];
                hostNode.__root.handlerRegistry[hostNode.__actionId] = hostNode.onClick;

                if (hostNode.__root) {
                  hostNode.__root.subscribeToNewActionId(hostNode.__actionId);
                }
              } else {
                hostNode[key] = update[key];
              }
            });
          });
          break;

        case DatePicker:
          updatePayload.forEach(update => {
            Object.keys(update).forEach(key => {
              if (key === "onChange") {
                if (hostNode.__root && hostNode.__root.handlerRegistry) {
                  delete hostNode.__root.handlerRegistry[hostNode.__actionId];

                  hostNode.__root.unsubscribeFromAction(hostNode.__actionId);
                }

                hostNode.__actionId = uuid();
                hostNode.onChange = update[key];
                hostNode.__root.handlerRegistry[hostNode.__actionId] = hostNode.onChange;

                if (hostNode.__root) {
                  hostNode.__root.subscribeToNewActionId(hostNode.__actionId);
                }
              } else {
                hostNode[key] = update[key];
              }
            });
          });
          break;

        default:
          updatePayload.forEach(update => {
            hostNode[key] = update[key];
          });
      }

      setImmediate(() => {
        hostNode.onCommit();
      }, 0);
    },

    resetTextContent(domElement) {
      throw new Error('Not implemented');
    },

    commitTextUpdate(textInstance, oldText, newText) {
      textInstance.setText(newText);
      setImmediate(() => {
        textInstance.onCommit();
      }, 0);
    },

    appendChild(parentInstance, child) {
      parentInstance.appendChild(child);
    },

    appendChildToContainer(container, child) {
      container.appendChild(child);
    },

    insertBefore(parentInstance, child, beforeChild) {},

    insertInContainerBefore(container, child, beforeChild) {
      container.insertBefore(child, beforeChild);
    },

    removeChild(parentInstance, child) {
      parentInstance.removeChild(child);
    },

    removeChildFromContainer(container, child) {
      container.removeChild(child);
    }

  };
  const reconciler = ReactReconciler(hostConfig);
  const SlackDOM = {
    render(component, container) {
      let reconcilerContainer = reconciler.createContainer(container, false, false);
      reconciler.updateContainer(component, reconcilerContainer, null, null);
      return container;
    }

  };

  var app = (() => ({
    components,
    container,
    SlackDom: SlackDOM
  }));

  return app;

}(react, _, ReactReconciler, uuid));
