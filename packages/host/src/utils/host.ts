// @ts-nocheck
import ReactReconciler from "react-reconciler";
import uuid from "uuid/v4";
import { createElement } from "./createElement";
import { Text } from '../components';
import { Button, DatePicker } from "../ui";

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

  prepareForCommit(containerInfo) { },

  resetAfterCommit(containerInfo) { },

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
      case Button:
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
      case DatePicker:
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

  commitMount() {
  },

  commitUpdate(
    hostNode:any,
    updatePayload:any,
    type:any,
  ) {
    switch (type) {
      case Button:
        updatePayload.forEach((update:any) => {
          Object.keys(update).forEach(key => {
            if (key === "onClick") {
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
      case DatePicker:
        updatePayload.forEach((update:any) => {
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
        updatePayload.forEach((update:any) => {
          // @ts-ignore
          hostNode[key] = update[key];
        });
    }
    setTimeout(() => {
      hostNode.onCommit();
    }, 0);
  },

  resetTextContent() {
    throw new Error('Not implemented');
  },

  commitTextUpdate(textInstance:any, oldText:string, newText:string) {
    textInstance.setText(newText);
    setTimeout(() => {
      textInstance.onCommit();
    }, 0);
  },

  appendChild(parentInstance:any, child:any) {
    parentInstance.appendChild(child);
  },

  appendChildToContainer(container:any, child:any) {
    container.appendChild(child);
  },

  insertBefore() {
  },

  insertInContainerBefore(container:any, child:any, beforeChild:any) {
    container.insertBefore(child, beforeChild);
  },

  removeChild(parentInstance:any, child:any) {
    parentInstance.removeChild(child);
  },

  removeChildFromContainer(container, child) {
    container.removeChild(child);
  }
};

const reconciler = ReactReconciler(hostConfig);

export const SlackDOM = {
  render(component:any, container:any) {
    let reconcilerContainer = reconciler.createContainer(
      container,
      false,
      false
    );
    reconciler.updateContainer(component, reconcilerContainer, null, null);

    return container;
  }
};
