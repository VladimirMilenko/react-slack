'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var lodash = require('lodash');
var events = require('events');
var ReactReconciler = _interopDefault(require('react-reconciler'));
var uuid = _interopDefault(require('uuid/v4'));

var RedisSlackContainer = function RedisSlackContainer(subClient, handlerRegistry) {
  var _this = this;

  this.unsubscribeFromAction = function (uuid) {
    _this.subClient.unsubscribe(uuid);
  };

  this.subscribeToNewActionId = function (uuid) {
    _this.subClient.subscribe(uuid);
  };

  this.appendChild = function (child) {
    _this.blocks.push(child);

    setTimeout(_this.onCommited, 0);
  };

  this.removeChild = function (child) {
    var index = _this.blocks.indexOf(child);

    _this.blocks.splice(index, 1);

    setTimeout(_this.onCommited, 0);
  };

  this.insertBefore = function (child, beforeChild) {
    var index = _this.blocks.indexOf(beforeChild);

    _this.blocks.splice(index, 0, child);

    setTimeout(_this.onCommited, 0);
  };

  this.onCommited = function () {
    var nextCommit = _this.render();

    if (!lodash.isEqual(_this.lastCommited, nextCommit)) {
      _this.emitter.emit('commit', nextCommit);

      _this.lastCommited = nextCommit;
    }
  };

  this.render = function () {
    // @ts-ignore
    return _this.blocks.map(function (x) {
      return x.render();
    });
  };

  this.handlerRegistry = handlerRegistry;
  this.subClient = subClient;
  this.blocks = [];
  this.emitter = new events.EventEmitter();
  this.subClient.on('message', function (channel, message) {
    if (_this.handlerRegistry[channel]) {
      var msg = JSON.parse(message);

      _this.handlerRegistry[channel](msg);
    }
  });
  this.lastCommited = null;
};

var ObjectSlackContainer = function ObjectSlackContainer() {
  var _this = this;

  this.unsubscribeFromAction = function () {};

  this.subscribeToNewActionId = function () {};

  this.appendChild = function (child) {
    _this.blocks.push(child);
  };

  this.removeChild = function (child) {
    var index = _this.blocks.indexOf(child);

    _this.blocks.splice(index, 1);
  };

  this.insertBefore = function (child, beforeChild) {
    var index = _this.blocks.indexOf(beforeChild);

    _this.blocks.splice(index, 0, child);
  };

  this.onCommited = function () {};

  this.render = function () {
    // @ts-ignore
    return _this.blocks.map(function (x) {
      return x.render();
    });
  };

  this.blocks = [];
  this.lastCommited = null;
};

var Button = "BUTTON";
var Actions = "ACTIONS";
var Context = "CONTEXT";
var Markdown = "MARKDOWN";
var Divider = "DIVIDER";
var Section = "SECTION";
var SectionText = "SECTION_TEXT";
var SectionFields = "SECTION_FIELDS";
var SectionAccessory = "SECTION_ACCESSORY";
var DatePicker = "DATEPICKER";

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var Child = /*#__PURE__*/function () {
  function Child(props, root, type) {
    this.props = props;
    this.__root = root;
    this.__type = type;
  }

  var _proto = Child.prototype;

  _proto.onCommit = function onCommit() {
    this.__root.onCommited();
  };

  return Child;
}();

var Actions$1 = /*#__PURE__*/function (_Child) {
  _inheritsLoose(Actions, _Child);

  function Actions(props, root) {
    var _this;

    _this = _Child.call(this, props, root, 'ACTIONS') || this;
    _this.elements = [];
    return _this;
  }

  var _proto = Actions.prototype;

  _proto.appendChild = function appendChild(child) {
    this.elements.push(child);
  };

  _proto.removeChild = function removeChild(child) {
    var index = this.elements.indexOf(child);
    this.elements.splice(index, 1);
  };

  _proto.insertBefore = function insertBefore(child, beforeChild) {
    var index = this.elements.indexOf(beforeChild);

    if (index === 0) {
      this.elements.unshift(child);
    } else {
      this.elements.splice(index - 1, 0, child);
    }
  };

  _proto.render = function render() {
    return {
      type: 'actions',
      elements: this.elements.map(function (x) {
        return x.render();
      })
    };
  };

  return Actions;
}(Child);

var Text = /*#__PURE__*/function (_Child) {
  _inheritsLoose(Text, _Child);

  function Text(text, root) {
    var _this;

    _this = _Child.call(this, {}, root, 'TEXT') || this;
    _this.text = text;
    return _this;
  }

  var _proto = Text.prototype;

  _proto.setText = function setText(text) {
    this.text = text;
  };

  _proto.render = function render() {
    return {
      type: 'plain_text',
      text: this.text
    };
  };

  return Text;
}(Child);

var getFakeRoot = function getFakeRoot() {
  return {
    onCommited: function onCommited() {}
  };
};

var Button$1 = /*#__PURE__*/function (_Child) {
  _inheritsLoose(Button, _Child);

  function Button(props, root) {
    var _this;

    _this = _Child.call(this, props, root, 'BUTTON') || this;
    _this.children = [];
    _this.style = props.style;
    _this.value = props.value;
    _this.onClick = props.onClick;
    return _this;
  }

  var _proto = Button.prototype;

  _proto.appendChild = function appendChild(child) {
    if (child.__type === 'TEXT') {
      this.children.push(child);
    }
  };

  _proto.removeChild = function removeChild(child) {
    var index = this.children.indexOf(child);
    this.children.splice(index, 1);
  };

  _proto.setActionId = function setActionId(actionId) {
    this.__actionId = actionId;
  };

  _proto.insertBefore = function insertBefore(child, beforeChild) {
    var index = this.children.indexOf(beforeChild);

    if (index === 0) {
      this.children.unshift(child);
    } else {
      this.children.splice(index - 1, 0, child);
    }
  };

  _proto.render = function render() {
    var style = this.style,
        value = this.value;
    return {
      type: 'button',
      text: new Text(this.children.map(function (x) {
        return x.text;
      }).join(''), getFakeRoot()).render(),
      action_id: this.__actionId,
      value: value,
      style: style
    };
  };

  return Button;
}(Child);

var Markdown$1 = /*#__PURE__*/function (_Child) {
  _inheritsLoose(Markdown, _Child);

  function Markdown(props, root) {
    var _this;

    _this = _Child.call(this, props, root, 'MARKDOWN') || this;
    _this.children = [];
    return _this;
  }

  var _proto = Markdown.prototype;

  _proto.appendChild = function appendChild(child) {
    this.children.push(child);
  };

  _proto.removeChild = function removeChild(child) {
    var index = this.children.indexOf(child);
    this.children.splice(index, 1);
  };

  _proto.insertBefore = function insertBefore(child, beforeChild) {
    var index = this.children.indexOf(beforeChild);

    if (index === 0) {
      this.children.unshift(child);
    } else {
      this.children.splice(index - 1, 0, child);
    }
  };

  _proto.render = function render() {
    return {
      type: 'mrkdwn',
      text: this.children.map(function (x) {
        return x.text;
      }).join('')
    };
  };

  return Markdown;
}(Child);

var Context$1 = /*#__PURE__*/function (_Child) {
  _inheritsLoose(Context, _Child);

  function Context(props, root) {
    var _this;

    _this = _Child.call(this, props, root, 'CONTEXT') || this;
    _this.elements = [];
    return _this;
  }

  var _proto = Context.prototype;

  _proto.appendChild = function appendChild(child) {
    this.elements.push(child);
  };

  _proto.removeChild = function removeChild(child) {
    var index = this.elements.indexOf(child);
    this.elements.splice(index, 1);
  };

  _proto.insertBefore = function insertBefore(child, beforeChild) {
    var index = this.elements.indexOf(beforeChild);

    if (index === 0) {
      this.elements.unshift(child);
    } else {
      this.elements.splice(index - 1, 0, child);
    }
  };

  _proto.render = function render() {
    return {
      type: 'context',
      elements: this.elements.map(function (x) {
        if (x instanceof Markdown$1) {
          return x.render();
        }

        if (x.__type === 'TEXT') {
          return new Text(x.text, getFakeRoot()).render();
        }

        return null;
      })
    };
  };

  return Context;
}(Child);

var Datepicker = /*#__PURE__*/function (_Child) {
  _inheritsLoose(Datepicker, _Child);

  function Datepicker(props, root) {
    var _this;

    _this = _Child.call(this, props, root, 'DATEPICKER') || this;
    _this.onChange = props.onChange;
    _this.value = props.value || undefined;
    _this.placeholder = props.placeholder;
    _this.initialDate = props.initialDate || undefined;
    _this.__actionId = props.actionId;
    return _this;
  }

  var _proto = Datepicker.prototype;

  _proto.setActionId = function setActionId(actionId) {
    this.__actionId = actionId;
  };

  _proto.render = function render() {
    var value = this.value,
        placeholder = this.placeholder,
        initialDate = this.initialDate,
        __actionId = this.__actionId;
    return {
      type: 'datepicker',
      placeholder: placeholder ? new Text(placeholder, getFakeRoot()).render() : undefined,
      action_id: __actionId,
      initial_date: value ? value : initialDate ? initialDate : undefined
    };
  };

  return Datepicker;
}(Child);

var Divider$1 = /*#__PURE__*/function (_Child) {
  _inheritsLoose(Divider, _Child);

  function Divider(props, root) {
    var _this;

    _this = _Child.call(this, props, root, 'DIVIDER') || this;
    _this.children = [];
    return _this;
  }

  var _proto = Divider.prototype;

  _proto.appendChild = function appendChild() {};

  _proto.removeChild = function removeChild() {};

  _proto.render = function render() {
    return {
      type: 'divider'
    };
  };

  return Divider;
}(Child);

var Section$1 = /*#__PURE__*/function (_Child) {
  _inheritsLoose(Section, _Child);

  function Section(props, root) {
    var _this;

    _this = _Child.call(this, props, root, 'SECTION') || this;
    _this.fields = null;
    _this.accessory = null;
    _this.text = null;
    _this.fields = null;
    _this.accessory = null;
    _this.text = null;
    return _this;
  }

  var _proto = Section.prototype;

  _proto.appendChild = function appendChild(child) {
    if (child instanceof SectionText$1) {
      this.text = child;
      return;
    }

    if (child instanceof SectionFields$1) {
      this.fields = child;
      return;
    }

    if (child instanceof SectionAccessory$1) {
      this.accessory = child;
      return;
    }

    throw new Error('Usupported type');
  };

  _proto.removeChild = function removeChild(child) {
    if (child instanceof SectionText$1) {
      this.text = null;
      return;
    }

    if (child instanceof SectionFields$1) {
      this.fields = null;
      return;
    }

    if (child instanceof SectionAccessory$1) {
      this.accessory = null;
      return;
    }

    throw new Error('Usupported type');
  };

  _proto.insertBefore = function insertBefore(child) {
    this.appendChild(child);
  };

  _proto.render = function render() {
    return {
      type: 'section',
      text: this.text ? this.text.render() : undefined,
      fields: this.fields ? this.fields.render() : undefined,
      accessory: this.accessory ? this.accessory.render() : undefined
    };
  };

  return Section;
}(Child);
var SectionText$1 = /*#__PURE__*/function (_Child2) {
  _inheritsLoose(SectionText, _Child2);

  function SectionText(props, root) {
    var _this2;

    _this2 = _Child2.call(this, props, root, 'SECTION_TEXT') || this;
    _this2.children = [];

    _this2.render = function () {
      return {
        type: _this2.children.some(function (x) {
          return x.__type === 'MARKDOWN';
        }) ? 'mrkdwn' : 'plain_text',
        text: _this2.children.map(function (x) {
          return x.render();
        }).map(function (x) {
          return x.text;
        }).join('')
      };
    };

    _this2.children = [];
    return _this2;
  }

  var _proto2 = SectionText.prototype;

  _proto2.appendChild = function appendChild(child) {
    this.children.push(child);
  };

  _proto2.removeChild = function removeChild(child) {
    var index = this.children.indexOf(child);
    this.children.splice(index, 1);
  };

  _proto2.insertBefore = function insertBefore(child, beforeChild) {
    var index = this.children.indexOf(beforeChild);

    if (index === 0) {
      this.children.unshift(child);
    } else {
      this.children.splice(index - 1, 0, child);
    }
  };

  return SectionText;
}(Child);
var SectionFields$1 = /*#__PURE__*/function (_Child3) {
  _inheritsLoose(SectionFields, _Child3);

  function SectionFields(props, root) {
    var _this3;

    _this3 = _Child3.call(this, props, root, 'SECTION_FIELDS') || this;
    _this3.children = [];

    _this3.render = function () {
      return _this3.children.map(function (x) {
        return x.render();
      });
    };

    _this3.children = [];
    return _this3;
  }

  var _proto3 = SectionFields.prototype;

  _proto3.appendChild = function appendChild(child) {
    this.children.push(child);
  };

  _proto3.removeChild = function removeChild(child) {
    var index = this.children.indexOf(child);
    this.children.splice(index, 1);
  };

  _proto3.insertBefore = function insertBefore(child, beforeChild) {
    var index = this.children.indexOf(beforeChild);

    if (index === 0) {
      this.children.unshift(child);
    } else {
      this.children.splice(index - 1, 0, child);
    }
  };

  return SectionFields;
}(Child);
var SectionAccessory$1 = /*#__PURE__*/function (_Child4) {
  _inheritsLoose(SectionAccessory, _Child4);

  function SectionAccessory(props, root) {
    var _this4;

    _this4 = _Child4.call(this, props, root, 'SECTION_ACCESSORY') || this;
    _this4.children = [];

    _this4.render = function () {
      if (_this4.children.length > 1) {
        throw new Error('Accessory only accepts one child');
      }

      if (!_this4.children || _this4.children.length === 0) {
        return null;
      }

      return _this4.children[0].render();
    };

    _this4.children = [];
    return _this4;
  }

  var _proto4 = SectionAccessory.prototype;

  _proto4.appendChild = function appendChild(child) {
    this.children.push(child);
  };

  _proto4.removeChild = function removeChild(child) {
    var index = this.children.indexOf(child);
    this.children.splice(index, 1);
  };

  _proto4.insertBefore = function insertBefore(child, beforeChild) {
    var index = this.children.indexOf(beforeChild);

    if (index === 0) {
      this.children.unshift(child);
    } else {
      this.children.splice(index - 1, 0, child);
    }
  };

  return SectionAccessory;
}(Child);

var createElement = function createElement(type, props, rootContainerInstance) {
  var LIB = {
    BUTTON: function BUTTON() {
      return new Button$1(props, rootContainerInstance);
    },
    ACTIONS: function ACTIONS() {
      return new Actions$1(props, rootContainerInstance);
    },
    CONTEXT: function CONTEXT() {
      return new Context$1(props, rootContainerInstance);
    },
    MARKDOWN: function MARKDOWN() {
      return new Markdown$1(props, rootContainerInstance);
    },
    DIVIDER: function DIVIDER() {
      return new Divider$1(props, rootContainerInstance);
    },
    SECTION: function SECTION() {
      return new Section$1(props, rootContainerInstance);
    },
    SECTION_TEXT: function SECTION_TEXT() {
      return new SectionText$1(props, rootContainerInstance);
    },
    SECTION_FIELDS: function SECTION_FIELDS() {
      return new SectionFields$1(props, rootContainerInstance);
    },
    SECTION_ACCESSORY: function SECTION_ACCESSORY() {
      return new SectionAccessory$1(props, rootContainerInstance);
    },
    DATEPICKER: function DATEPICKER() {
      return new Datepicker(props, rootContainerInstance);
    }
  };

  if (typeof LIB[type] === 'function') {
    return LIB[type]();
  }

  throw new Error('Unsupported element type');
};

// @ts-nocheck
var hostConfig = {
  getRootHostContext: function getRootHostContext(rootContainerInstance) {
    return {
      root: rootContainerInstance
    };
  },
  getChildHostContext: function getChildHostContext(parentHostContext, type, rootContainerInstance) {
    return {};
  },
  getPublicInstance: function getPublicInstance(instance) {
    return {};
  },
  prepareForCommit: function prepareForCommit(containerInfo) {},
  resetAfterCommit: function resetAfterCommit(containerInfo) {},
  createInstance: function createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
    return createElement(type, props, rootContainerInstance);
  },
  createTextInstance: function createTextInstance(text, rootContainerInstance, hostContext, internalInstanceHandle) {
    return new Text(text, rootContainerInstance);
  },
  appendInitialChild: function appendInitialChild(parentInstance, child) {
    parentInstance.appendChild(child);
  },
  finalizeInitialChildren: function finalizeInitialChildren(hostNode, type, props, rootContainerInstance, hostContext) {
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
  prepareUpdate: function prepareUpdate(domElement, type, oldProps, newProps, rootContainerInstance, hostContext) {
    var propKeys = new Set(Object.keys(newProps).concat(Object.keys(oldProps))).values();
    var payload = [];

    for (var _iterator = propKeys, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var _key = _ref;

      if (_key !== "children" && // text children are already handled
      oldProps[_key] !== newProps[_key]) {
        var _payload$push;

        payload.push((_payload$push = {}, _payload$push[_key] = newProps[_key], _payload$push));
      }
    }

    return payload;
  },
  shouldSetTextContent: function shouldSetTextContent(type, props) {
    return false;
  },
  shouldDeprioritizeSubtree: function shouldDeprioritizeSubtree(type, props) {
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
  commitMount: function commitMount() {},
  commitUpdate: function commitUpdate(hostNode, updatePayload, type) {
    switch (type) {
      case Button:
        updatePayload.forEach(function (update) {
          Object.keys(update).forEach(function (key) {
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
        updatePayload.forEach(function (update) {
          Object.keys(update).forEach(function (key) {
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
        updatePayload.forEach(function (update) {
          // @ts-ignore
          hostNode[key] = update[key];
        });
    }

    setTimeout(function () {
      hostNode.onCommit();
    }, 0);
  },
  resetTextContent: function resetTextContent() {
    throw new Error('Not implemented');
  },
  commitTextUpdate: function commitTextUpdate(textInstance, oldText, newText) {
    textInstance.setText(newText);
    setTimeout(function () {
      textInstance.onCommit();
    }, 0);
  },
  appendChild: function appendChild(parentInstance, child) {
    parentInstance.appendChild(child);
  },
  appendChildToContainer: function appendChildToContainer(container, child) {
    container.appendChild(child);
  },
  insertBefore: function insertBefore() {},
  insertInContainerBefore: function insertInContainerBefore(container, child, beforeChild) {
    container.insertBefore(child, beforeChild);
  },
  removeChild: function removeChild(parentInstance, child) {
    parentInstance.removeChild(child);
  },
  removeChildFromContainer: function removeChildFromContainer(container, child) {
    container.removeChild(child);
  }
};
var reconciler = /*#__PURE__*/ReactReconciler(hostConfig);
var SlackDOM = {
  render: function render(component, container) {
    var reconcilerContainer = reconciler.createContainer(container, false, false);
    reconciler.updateContainer(component, reconcilerContainer, null, null);
    return container;
  }
};

exports.Actions = Actions;
exports.Button = Button;
exports.Context = Context;
exports.DatePicker = DatePicker;
exports.Divider = Divider;
exports.Markdown = Markdown;
exports.ObjectSlackContainer = ObjectSlackContainer;
exports.RedisSlackContainer = RedisSlackContainer;
exports.Section = Section;
exports.SectionAccessory = SectionAccessory;
exports.SectionFields = SectionFields;
exports.SectionText = SectionText;
exports.SlackDOM = SlackDOM;
//# sourceMappingURL=host.cjs.development.js.map
