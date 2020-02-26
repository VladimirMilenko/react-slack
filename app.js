import React from 'react';
import _ from "lodash";
import { WebClient } from "@slack/web-api";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import nodeFetch from "node-fetch";
import redis from "redis";
import { SlackContainer } from "./slack-renderer/container";
import SlackDOM from './slack-renderer';
import StatelessApp from './messages/Form';
import OnlyInPrivate from './messages/OnlyInPrivate';

const subClient = redis.createClient({
  detect_buffers: true,
  host: "localhost",
  port: 6379
});
const pubClient = redis.createClient({
  detect_buffers: true,
  host: "localhost",
  port: 6379
});

const handlerRegistry = {};

const web = new WebClient(
  "xoxb-963559108900-964036536053-z4FSMbqp1rVI7lHwsCnk5jHi"
);

const server = express();
server.use(cors());
server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: false
  })
);

server.post('/wh/ephemeral', async (req, res) => {
  console.log('request');
  const { channel_id, channel_name, user_id, command, response_url } = req.body;

  const statefulContainer = new SlackContainer(subClient, handlerRegistry, response_url);

  let beforeMountTree = null;
  const tempHandler = (msg) => beforeMountTree = msg;

  statefulContainer.emitter.on('commit', tempHandler);

  SlackDOM.render(<StatelessApp />, statefulContainer);
  /*
  const result = await web.chat.postEphemeral({
    channel: channel_id,
    user: user_id,
    blocks: statefulContainer.render()
  });
*/
  async function sendUpdate(updatedMessage) {
    console.log('update');
    /*
    Ephemeral updates are not in place for dynamic UI
    */
  }

  if (beforeMountTree) {
    sendUpdate(beforeMountTree);
  }

  statefulContainer.emitter.on("commit", sendUpdate);
  statefulContainer.emitter.removeListener("commit", tempHandler);
});

server.post("/wh/handle_action", (req, res) => {
  console.log("action!");
  const hook = req.body.payload;


  if (typeof hook === "string") {
    const payloadObject = JSON.parse(hook);
    const { actions, response_url } = payloadObject;
    if (Array.isArray(actions) && actions.length > 0) {
      actions.forEach(action => {
        pubClient.publish(
          action.action_id,
          JSON.stringify({ ...action, response_url }),
          (err, clientsReceived) => {
            if (err) {
              console.log("failed to publish");
            }

            if (clientsReceived > 0) {
              return res.status(200).send({ ok: true });
            } else {
              console.log("message is outdated");
              return res.status(504).send();
            }
          }
        );
      });
    }
  }
});

server.listen(3000);
