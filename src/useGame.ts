import usePartySocket from "partysocket/react";
import { getPostId } from "./utils";
import { useState } from "react";
import {
  parseUpdate,
  type Action,
  createAction,
  type GameState,
} from "./server/types";
import { username } from "./main";

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
    id: username,
    onMessage(event: MessageEvent<string>) {
      const data = parseUpdate(event.data);
      switch (data.action) {
        case "game":
          console.log("Game update:", data.value);
          setGame(data.value);
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
    game,
    myTurn: game?.currentTurn === socket.id,
    playerId: socket.id,
  };
}

export type Game = ReturnType<typeof useGame>;
