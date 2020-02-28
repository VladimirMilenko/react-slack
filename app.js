import React from 'react';
import { SlackContainer } from "./slack-renderer/container";
import * as components from './slack-renderer/components';
import * as container from './slack-renderer/container';
import SlackDom from './slack-renderer/index';

window.SlackRender = function SlackRender() {
  return {
    components,
    container,
    SlackDom
  }
}
