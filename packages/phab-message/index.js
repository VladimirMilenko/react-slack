import React from 'react';
import ReactDOM from 'react-dom';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider, styled } from 'baseui';
import { StatefulInput } from 'baseui/input';
import { Select } from 'baseui/select';
import { Modal, ModalButton, ModalHeader, ModalBody, ModalFooter, SIZE, ROLE } from 'baseui/modal';
import { toaster, ToasterContainer } from 'baseui/toast';
import { ObjectSlackContainer, Button, Section, SectionFields, SlackDOM } from '@slack-react/host';
import { getReviewers, getAuthor, getJiraIssues, getStatus, getDiffId, getDiffTitle } from './utils';
import { DiffMessage } from './src/components/Message';


const engine = new Styletron();

function createMessage(props) {
  const container = new ObjectSlackContainer();

  SlackDOM.render(<DiffMessage {...props} />, container);

  return container.render();
}

function getDiffForSlack() {
  const author = getAuthor();
  const reviewers = getReviewers();
  const status = getStatus();
  const diffId = getDiffId();
  const title = getDiffTitle();
  const jiraIssues = getJiraIssues();

  return createMessage({ author, reviewers, status, diffId, title, jiraIssues });
}

const SendModal = ({ channels, onSend }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [channel, setChannel] = React.useState([channels[0]]);

  React.useEffect(() => {
    toaster.positive('Slack messenger attached', { autoHideDuration: 5000 });
  }, []);
  return (
    <>
      <Modal
        onClose={() => setIsOpen(false)}
        closeable
        isOpen={isOpen}
        size={SIZE.default}
        role={ROLE.dialog}
      >
        <ModalHeader>Send to slack</ModalHeader>
        <ModalBody>
          I will send the into to slack channel:
          <Select value={channel} options={channels} onChange={(e) => setChannel(e.value)} />
        </ModalBody>
        <ModalFooter>
          <ModalButton onClick={() => {
            const message = getDiffForSlack();
            onSend({ blocks: message }, channel[0]);
            toaster.positive('sent');
            setIsOpen(false);
          }}>Send</ModalButton>
        </ModalFooter>
      </Modal >
      <KeyboardEventHandler handleKeys={['ctrl+alt+z']} onKeyEvent={() => setIsOpen(true)} />
    </>
  )
};

const InjectApp = ({ channels, onSend }) => (
  <StyletronProvider value={engine}>
    <BaseProvider theme={LightTheme}>
      <ToasterContainer placement="topRight">
        <SendModal channels={channels} onSend={onSend} />
      </ToasterContainer>
    </BaseProvider>
  </StyletronProvider>
)

const rootNode = document.createElement('div');
document.body.appendChild(rootNode);


window.__installHook = (channels, onSend) => {
  ReactDOM.render(<InjectApp channels={channels} onSend={onSend} />, rootNode);
};
