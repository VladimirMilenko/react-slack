import React from "react";
import { useInterval } from "react-use";
import { Context, Button, Actions } from "@slack-react/host";

export const Counter = () => {
  const [counter, setCounter] = React.useState(0);
  const handleIncrease = React.useCallback(() => {
    setCounter(counter + 1);
  }, [counter, setCounter]);


  return (
    <>
      <Actions>
        <Button onClick={handleIncrease}>Add</Button>
      </Actions>
      <Context>Counter: {counter}</Context>
    </>
  );
};
