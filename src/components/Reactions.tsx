import { useState } from "react";
import usePartySocket from "partysocket/react";
import { parseUpdate, type Action, createAction } from "../server/types";

// In case of custom setup, change this to your server's host
const host = import.meta.env.PROD
  ? window.location.origin
  : "http://localhost:1999";

export const Reactions = ({ postID }: { postID: string }) => {
  const [typing, setTyping] = useState<string>("");

  const socket = usePartySocket({
    host,
    room: postID,
    onMessage(event: MessageEvent<string>) {
      const data = parseUpdate(event.data);
      setTyping(data.value);
    },
  });

  function send(action: Action) {
    socket.send(createAction(action));
  }

  return (
    <div>
      <input
        onChange={(e) =>
          send({
            action: "type",
            value: e.target.value,
          })
        }
        value={typing}
      ></input>
    </div>
  );
};
