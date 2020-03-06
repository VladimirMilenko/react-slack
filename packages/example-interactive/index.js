import React from 'react';
import {RedisSlackContainer, SlackDOM} from '@slack-react/host';
import { WebClient } from "@slack/web-api";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import nodeFetch from "node-fetch";
import redis from 'redis';
import {Counter} from './src/Counter';

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
const token = "";
const web = new WebClient(
  token
);

const server = express();
server.use(cors());
server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: false
  })
);


const statefulUpdateHandler = async (container, App, params) => {
  let beforeMountTree = null;
  const tempHandler = (msg) => beforeMountTree = msg;

  container.emitter.on('commit', tempHandler);

  SlackDOM.render(App, container);
  const blocks = container.render();

  const {ok, ts} = await web.chat.postMessage({blocks, channel: params.channel_id});
  if(!ok) {
    container.emitter.removeListener("commit", tempHandler);
    throw new Error('Cannot handle updates');
  }

  async function sendUpdate(updatedMessage) {
    web.chat.update({
      channel: params.channel_id,
      ts,
      blocks: updatedMessage
    }).then(({ok}) => {
      console.log({ok});
    })
  }

  if (beforeMountTree) {
    sendUpdate(beforeMountTree);
  }

  container.emitter.on("commit", sendUpdate);
  container.emitter.removeListener("commit", tempHandler);
};


server.post('/wh/action', async (req, res) => {
  const { channel_id, channel_name, user_id, command, response_url, text } = req.body;
  switch(command) {
    case '/counter':
      const container = new RedisSlackContainer(subClient, handlerRegistry);
      return statefulUpdateHandler(container, <Counter />, {channel_id, user_id});

    default:
      break;
  }

  res.status(200).send();
});


server.post("/wh/handle_action", (req, res) => {
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
