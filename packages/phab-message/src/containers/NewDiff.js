import React from 'react';
import { Block } from 'baseui/block';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import {
  Checkbox,
  LABEL_PLACEMENT
} from "baseui/checkbox";
import { Select } from 'baseui/select';
import { Modal, ModalButton, ModalHeader, ModalBody, ModalFooter, SIZE, ROLE } from 'baseui/modal';
import { toaster, ToasterContainer } from 'baseui/toast';
import { ObjectSlackContainer, Button, Section, SectionFields, SlackDOM } from '@slack-react/host';
import { getReviewers, getAuthor, getJiraIssues, getStatus, getDiffId, getDiffTitle } from '../utils';
import { DiffMessage } from '../components/Message';


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

const SendModal = ({ channels, fetch }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [channel, setChannel] = React.useState([channels[0]]);
  const [addToQueue, setAddToQueue] = React.useState(true);

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
        <ModalHeader>Add diff to queue</ModalHeader>
        <ModalBody>
          <Checkbox
            checked={addToQueue}
            onChange={e => setAddToQueue(e.target.checked)}
            labelPlacement={LABEL_PLACEMENT.right}
          >
            Add to queue
        </Checkbox>
          <Block marginTop="scale800">
            <Select value={channel} options={channels} onChange={(e) => setChannel(e.value)} />
          </Block>
        </ModalBody>
        <ModalFooter>
          <ModalButton onClick={() => {
            const message = getDiffForSlack();
            if (addToQueue) {
              const diffId = getDiffId();
              fetch(channel[0], {text: '!wadd ' + diffId});
            }
            fetch(channel[0], {blocks: messsage});

            toaster.positive('sent');
            setIsOpen(false);
          }}>Send</ModalButton>
        </ModalFooter>
      </Modal >
      <KeyboardEventHandler handleKeys={['ctrl+alt+c']} onKeyEvent={() => setIsOpen(true)} />
    </>
  )
};


export default SendModal;
