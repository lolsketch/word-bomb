import { useCallback, useState } from "react";
import usePartySocket from "partysocket/react";
import throttle from "lodash.throttle";
import s from "./Reactions.module.css";
import { createActionMessage, parseUpdateMessage } from "../server/types";

// In case of custom setup, change this to your server's host
const host = import.meta.env.PROD
  ? window.location.origin
  : "http://localhost:1999";

export const Reactions = ({ postID }: { postID: string }) => {
  const [count, setCount] = useState<number | null>(null);

  const socket = usePartySocket({
    host,
    room: postID,
    onMessage(event) {
      const message = parseUpdateMessage(event.data);
      setCount(message.count);
    },
  });

  const vote = (action: "upvote" | "downvote") => {
    socket.send(createActionMessage(action));
  };

  return (
    <div>
      <button disabled={count === null} onClick={() => vote("upvote")}>
        <span>👍</span>
      </button>

      <span className={s.counter}>{count ?? "-"}</span>

      <button disabled={count === null} onClick={() => vote("downvote")}>
        <span>👎</span>
      </button>
    </div>
  );
};
