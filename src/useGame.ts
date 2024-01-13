import usePartySocket from "partysocket/react";
import { getPostId } from "./utils";
import { useState } from "react";
import {
  parseUpdate,
  type Action,
  createAction,
  type GameState,
} from "./server/types";

// In case of custom setup, change this to your server's host
const host = import.meta.env.PROD
  ? window.location.origin
  : "http://localhost:1999";

export function useGame() {
  const [game, setGame] = useState<GameState | undefined>();

  const postID = getPostId();
  const socket = usePartySocket({
    host,
    room: postID,
    onMessage(event: MessageEvent<string>) {
      const data = parseUpdate(event.data);
      switch (data.action) {
        case "game":
          console.log("Game update:", data.value);
          setGame(data.value);

          if (data.value.players[socket.id].lives <= 0) {
            // close the browser tab
            window.close();
          }
          break;
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
    currentAnswer: game?.typing ?? "",
    onGuess: (guess: string) => {
      send({ action: "guess", value: guess });
    },
    start() {
      send({ action: "start" });
    },
    myID: socket.id,
    game,
  };
}

export type Game = ReturnType<typeof useGame>;
