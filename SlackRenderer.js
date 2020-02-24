import ReactReconciler from "react-reconciler";
import { createElement, Text } from "./createElement";
import uuid from "uuid/v4";

const rootHostContext = {};
const childHostContext = {};

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
    console.log("getPublicInstance");
  },

  prepareForCommit(containerInfo) {},

  resetAfterCommit(containerInfo) {},

  createInstance(
    type,
    props,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) {
    return createElement(type, props, rootContainerInstance);
  },

  createTextInstance(
    text,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) {
    return new Text(text, rootContainerInstance);
  },

  appendInitialChild(parentInstance, child) {
    parentInstance.appendChild(child);
  },

  finalizeInitialChildren(
    hostNode,
    type,
    props,
    rootContainerInstance,
    hostContext
  ) {
    switch (type) {
      case "BUTTON":
        if (props.onClick) {
          if (
            hostNode.__root &&
            hostNode.__root.handlerRegistry &&
            hostNode.__actionId
          ) {
            delete hostNode.__root.handlerRegistry[hostNode.__actionId];
            hostNode.__root.unsubscribeFromAction(hostNode.__actionId);
          }
          hostNode.__actionId = uuid();

          hostNode.onClick = props.onClick;

          hostNode.__root.handlerRegistry[hostNode.__actionId] =
            hostNode.onClick;

          if (hostNode.__root) {
            hostNode.__root.subscribeToNewActionId(hostNode.__actionId);
          }
        }
        return;
      case "DATEPICKER":
        case "BUTTON":
          if (props.onChange) {
            if (
              hostNode.__root &&
              hostNode.__root.handlerRegistry &&
              hostNode.__actionId
            ) {
              delete hostNode.__root.handlerRegistry[hostNode.__actionId];
              hostNode.__root.unsubscribeFromAction(hostNode.__actionId);
            }
            hostNode.__actionId = uuid();

            hostNode.onChange = props.onChange;


            hostNode.__root.handlerRegistry[hostNode.__actionId] =
              hostNode.onChange;

            if (hostNode.__root) {
              hostNode.__root.subscribeToNewActionId(hostNode.__actionId);
            }
          }
          return;
      default:
        return;
    }

    return false;
  },
  prepareUpdate(
    domElement,
    type,
    oldProps,
    newProps,
    rootContainerInstance,
    hostContext
  ) {
    const propKeys = new Set(
      Object.keys(newProps).concat(Object.keys(oldProps))
    ).values();
    const payload = [];
    for (let key of propKeys) {
      if (
        key !== "children" && // text children are already handled
        oldProps[key] !== newProps[key]
      ) {
        console.log(key);
        payload.push({ [key]: newProps[key] });
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

  commitMount(domElement, type, newProps, internalInstanceHandle) {
    console.log("commit mount");
  },

  commitUpdate(
    hostNode,
    updatePayload,
    type,
    oldProps,
    newProps,
    internalInstanceHandle
  ) {
    switch (type) {
      case "BUTTON":
        updatePayload.forEach(update => {
          Object.keys(update).forEach(key => {
            if (key === "onClick") {
              console.log(hostNode);
              if (hostNode.__root && hostNode.__root.handlerRegistry) {
                delete hostNode.__root.handlerRegistry[hostNode.__actionId];
                hostNode.__root.unsubscribeFromAction(hostNode.__actionId);
              }
              hostNode.__actionId = uuid();

              hostNode.onClick = update[key];

              hostNode.__root.handlerRegistry[hostNode.__actionId] =
                hostNode.onClick;
              if (hostNode.__root) {
                hostNode.__root.subscribeToNewActionId(hostNode.__actionId);
              }
            } else {
              hostNode[key] = update[key];
            }
          });
        });
        break;
      case "DATEPICKER":
        updatePayload.forEach(update => {
          Object.keys(update).forEach(key => {
            if (key === "onChange") {
              if (hostNode.__root && hostNode.__root.handlerRegistry) {
                delete hostNode.__root.handlerRegistry[hostNode.__actionId];
                hostNode.__root.unsubscribeFromAction(hostNode.__actionId);
              }
              hostNode.__actionId = uuid();

              hostNode.onChange = update[key];

              hostNode.__root.handlerRegistry[hostNode.__actionId] =
                hostNode.onChange;
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
    console.log(domElement);
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

  insertBefore(parentInstance, child, beforeChild) {
    console.log("insert before");
    console.log("insertBefore");
  },

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

let JsonDOM = {
  render(component, container) {
    let reconcilerContainer = reconciler.createContainer(
      container,
      false,
      false
    );
    reconciler.updateContainer(component, reconcilerContainer, null, null);

    return container;
  }
};

export default JsonDOM;
