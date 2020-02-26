import React from "react";

import {
  Context,
} from "../slack-renderer/components";


const OnlyInPrivate = () => {
  return (
    <Context>
      This is only supported in direct messages
    </Context>
  );
};


export default OnlyInPrivate;
