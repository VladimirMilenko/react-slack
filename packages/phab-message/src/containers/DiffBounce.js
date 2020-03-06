import React from "react";
import { Block } from "baseui/block";
import KeyboardEventHandler from "react-keyboard-event-handler";
import { Select } from "baseui/select";
import {
  Modal,
  ModalButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
  SIZE,
  ROLE
} from "baseui/modal";
import { toaster, ToasterContainer } from "baseui/toast";
import {
  getDiffId,
} from "../utils";
import { DiffMessage } from "../components/Message";

const SendModal = ({ channels, fetch }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [channel, setChannel] = React.useState([channels[0]]);

  return (
    <>
      <Modal
        onClose={() => setIsOpen(false)}
        closeable
        isOpen={isOpen}
        size={SIZE.default}
        role={ROLE.dialog}
      >
        <ModalHeader>Bounce diff back</ModalHeader>
        <ModalBody>
          <Block marginTop="scale800">
            <Select
              value={channel}
              options={channels}
              onChange={e => setChannel(e.value)}
            />
          </Block>
        </ModalBody>
        <ModalFooter>
          <ModalButton
            onClick={() => {
              const diffId = getDiffId();
              fetch(channel[0], { text: "!wbounce " + diffId });
              toaster.positive("sent");
              setIsOpen(false);

            }}
          >
            Send
          </ModalButton>
        </ModalFooter>
      </Modal>
      <KeyboardEventHandler
        handleKeys={["ctrl+alt+z"]}
        onKeyEvent={() => setIsOpen(true)}
      />
    </>
  );
};

export default SendModal;
