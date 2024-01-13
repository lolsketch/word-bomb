import usePartySocket from "partysocket/react";
import { getPostId } from "./utils";
import { useState } from "react";
import { parseUpdate, type Action, createAction } from "./server/types";

// In case of custom setup, change this to your server's host
const host = import.meta.env.PROD
  ? window.location.origin
  : "http://localhost:1999";

export function useGame() {
  const [typing, setTyping] = useState("");

  const postID = getPostId();
  const socket = usePartySocket({
    host,
    room: postID,
    onMessage(event: MessageEvent<string>) {
      const data = parseUpdate(event.data);
      switch (data.action) {
        case "typing":
          setTyping(data.value);
          break;
        case "game":
          console.log("Game update:", data.value);
      }
    },
  });

  function send(action: Action) {
    socket.send(createAction(action));
  }

  return {
    onTypeAnswer: (answer: string) => {
      send({ action: "type", value: answer });
    },
    currentAnswer: typing,
  };
}
