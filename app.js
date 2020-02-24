import SlackRenderer from "./SlackRenderer";
import React, { Component, useState, useEffect } from "react";
import EventEmitter from "events";
import _ from "lodash";
import { WebClient } from "@slack/web-api";
import { useInterval } from "react-use";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import nodeFetch from "node-fetch";
import { GET_MSG, GET_RANDOM_MSG } from "./query";
import redis from 'redis';

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
  useLazyQuery,
  useQuery
} from "@apollo/client";
import {
  MemoryRouter,
  Route,
  useHistory,
  useLocation,
  Switch
} from "react-router";
import {
  Button,
  Actions,
  Context,
  Markdown,
  Section,
  SectionText,
  SectionFields,
  SectionAccessory
} from "./components";

const Message = () => {
  const history = useHistory();
  const [getMsg, { loading, data, called }] = useLazyQuery(GET_MSG);

  return (
    <React.Fragment>
      <Section>
        <SectionText>
          <Markdown>*Main Page*{"\n"}</Markdown>
          <Markdown>
            This is a Slack bot which is rendered by custom React renderer. This
            demo inculdes usage of interactive actions, which will trigger page
            changes {"\n\n\n\n\n\n"}
          </Markdown>
          <Markdown>*GraphQL Render*{"\n"}</Markdown>
          <Markdown>
            *Loading*: {loading.toString()}
            {"\n"}
          </Markdown>
          {data && (
            <Markdown>
              Loaded GQL Message: {data.hello}
              {"\n"}
            </Markdown>
          )}
        </SectionText>
      </Section>
      <Actions>
        <Button style="primary" onClick={() => {
          console.log('click');
          getMsg();
        }}>
          Open help page
        </Button>
      </Actions>
    </React.Fragment>
  );
};

const App = () => {
  return (
    <ApolloProvider client={client}>
      <MemoryRouter>
        <Switch>
          <Route exact path="/">
            <Message />
          </Route>
        </Switch>
      </MemoryRouter>
    </ApolloProvider>
  );
};

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "https://beqx4.sse.codesandbox.io/",
    fetch: nodeFetch
  })
});

const subClient = redis.createClient({ detect_buffers: true, host: 'localhost', port: 6379 });
const pubClient = redis.createClient({ detect_buffers: true, host: 'localhost', port: 6379 });


class SlackContainer {
  constructor(handlerRegistry) {
    this.blocks = [];
    this.handlerRegistry = handlerRegistry;
    this.emitter = new EventEmitter();

    subClient.on('message', (channel, message) => {
      console.log(channel);
      if(this.handlerRegistry[channel]) {
        this.handlerRegistry[channel](JSON.parse(message));
      }
    });
  }

  unsubscribeFromAction = (uuid) => {
    subClient.unsubscribe(uuid);
    console.log('unsub: ' + uuid);

  };

  subscribeToNewActionId = (uuid) => {
    subClient.subscribe(uuid);
    console.log('sub:' + uuid);
  };

  appendChild = child => {
    this.blocks.push(child);
    this.emitter.emit("commit", this.render());
  };

  removeChild = child => {
    const index = this.blocks.indexOf(child);

    this.blocks.splice(index, 1);
    this.emitter.emit("commit", this.render());
  };
  insertBefore = (child, beforeChild) => {
    const index = this.blocks.indexOf(beforeChild);

    this.blocks.splice(index, 0, child);
    this.emitter.emit("commit", this.render());
  };

  onCommited = () => {
    this.emitter.emit("commit", this.render());
  };
  render = () => {
    return this.blocks.map(x => x.render());
  };
}

const handlerRegistry = {};

const createMessage = () => {
  const container = new SlackContainer(handlerRegistry);
  SlackRenderer.render(<App />, container);
  return container;
};

const web = new WebClient(
  "xoxb-963559108900-964036536053-z4FSMbqp1rVI7lHwsCnk5jHi"
);

async function sendMessage() {
  const container = createMessage();
  let mounted = false;
  let temp = null;

  const tempHandler = (msg) => {
    temp = msg;
  }
  container.emitter.on("commit", tempHandler);


  const result = await web.chat.postMessage({
    channel: "CU2FED81X",
    blocks: container.render()
  });

  const { ok, ts } = result;
  if (!ok) {
    console.error("Error");
  }

  function sendUpdate(updatedMessage) {
    web.chat.update({
      channel: "CU2FED81X",
      ts,
      blocks: updatedMessage
    }).then(({ok}) => {
      console.log({ok});
    })
  }

  const updater = _.debounce(sendUpdate, 500);

  if(temp) {
    sendUpdate(temp)
  }
  container.emitter.on('commit', updater);
  container.emitter.removeListener('commit', tempHandler);

}
sendMessage();
const exit = false;

(function wait() {
  if (!exit) setTimeout(wait, 1000);
})();

const server = express();
server.use(cors());
server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: false
  })
);


server.post("/wh/handle_action", (req, res) => {
  const hook = req.body.payload;
  if (typeof hook === "string") {
    const payloadObject = JSON.parse(hook);
    const actions = payloadObject.actions;
    if (Array.isArray(actions) && actions.length > 0) {
      actions.forEach(action => {
        pubClient.publish(action.action_id, JSON.stringify(action), (err, clientsReceived) => {
          if(err) {
            console.log('failed to publish');
          }

          if(clientsReceived > 0) {
            res.status(200).send({ ok: true });
          } else {
            console.log('message is outdated');
          }
        });
      })
    }
  }
});

server.listen(3000);
