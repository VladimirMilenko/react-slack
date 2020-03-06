import React from 'react';
import ReactDOM from 'react-dom';
import InjectApp from './src/root';


const rootNode = document.createElement('div');
document.body.appendChild(rootNode);

window.__installHook = (channels, fetch) => {
  ReactDOM.render(<InjectApp channels={channels} fetch={fetch} />, rootNode);
};
