import React from 'react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider, styled } from 'baseui';
import { LayersManager } from 'baseui/layer';
import {ToasterContainer} from 'baseui/toast';
import NewDiff from './containers/NewDiff';
import DiffDone from './containers/DiffDone';
import DiffBounce from './containers/DiffBounce';


const engine = new Styletron();

const InjectApp = ({ channels, fetch }) => (
  <StyletronProvider value={engine}>
    <BaseProvider theme={LightTheme}>
      <LayersManager zIndex={10000}>
        <ToasterContainer placement="topRight">
          <NewDiff channels={channels} fetch={fetch} />
          <DiffDone channels={channels} fetch={fetch} />
          <DiffBounce channels={channels} fetch={fetch} />
        </ToasterContainer>
      </LayersManager>
    </BaseProvider>
  </StyletronProvider>
);

export default InjectApp;
