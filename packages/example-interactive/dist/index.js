// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/Counter/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Counter = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactUse = require("react-use");

var _host = require("@slack-react/host");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Counter = () => {
  const [counter, setCounter] = _react.default.useState(0);

  const handleIncrease = _react.default.useCallback(() => {
    setCounter(counter + 1);
  }, [counter, setCounter]);

  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_host.Actions, null, _react.default.createElement(_host.Button, {
    onClick: handleIncrease
  }, "Add")), _react.default.createElement(_host.Context, null, "Counter: ", counter));
};

exports.Counter = Counter;
},{}],"index.js":[function(require,module,exports) {
"use strict";

var _react = _interopRequireDefault(require("react"));

var _host = require("@slack-react/host");

var _webApi = require("@slack/web-api");

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _redis = _interopRequireDefault(require("redis"));

var _Counter = require("./src/Counter");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const subClient = _redis.default.createClient({
  detect_buffers: true,
  host: "localhost",
  port: 6379
});

const pubClient = _redis.default.createClient({
  detect_buffers: true,
  host: "localhost",
  port: 6379
});

const handlerRegistry = {};
const token = "";
const web = new _webApi.WebClient(token);
const server = (0, _express.default)();
server.use((0, _cors.default)());
server.use(_bodyParser.default.json());
server.use(_bodyParser.default.urlencoded({
  extended: false
}));

const statefulUpdateHandler = async (container, App, params) => {
  let beforeMountTree = null;

  const tempHandler = msg => beforeMountTree = msg;

  container.emitter.on('commit', tempHandler);

  _host.SlackDOM.render(App, container);

  const blocks = container.render();
  const {
    ok,
    ts
  } = await web.chat.postMessage({
    blocks,
    channel: params.channel_id
  });

  if (!ok) {
    container.emitter.removeListener("commit", tempHandler);
    throw new Error('Cannot handle updates');
  }

  async function sendUpdate(updatedMessage) {
    web.chat.update({
      channel: params.channel_id,
      ts,
      blocks: updatedMessage
    }).then(({
      ok
    }) => {
      console.log({
        ok
      });
    });
  }

  if (beforeMountTree) {
    sendUpdate(beforeMountTree);
  }

  container.emitter.on("commit", sendUpdate);
  container.emitter.removeListener("commit", tempHandler);
};

server.post('/wh/action', async (req, res) => {
  const {
    channel_id,
    channel_name,
    user_id,
    command,
    response_url,
    text
  } = req.body;

  switch (command) {
    case '/counter':
      const container = new _host.RedisSlackContainer(subClient, handlerRegistry);
      return statefulUpdateHandler(container, _react.default.createElement(_Counter.Counter, null), {
        channel_id,
        user_id
      });

    default:
      break;
  }

  res.status(200).send();
});
server.post("/wh/handle_action", (req, res) => {
  const hook = req.body.payload;

  if (typeof hook === "string") {
    const payloadObject = JSON.parse(hook);
    const {
      actions,
      response_url
    } = payloadObject;

    if (Array.isArray(actions) && actions.length > 0) {
      actions.forEach(action => {
        pubClient.publish(action.action_id, JSON.stringify(_objectSpread({}, action, {
          response_url
        })), (err, clientsReceived) => {
          if (err) {
            console.log("failed to publish");
          }

          if (clientsReceived > 0) {
            return res.status(200).send({
              ok: true
            });
          } else {
            console.log("message is outdated");
            return res.status(504).send();
          }
        });
      });
    }
  }
});
server.listen(3000);
},{"./src/Counter":"src/Counter/index.js"}]},{},["index.js"], null)
//# sourceMappingURL=/index.js.map