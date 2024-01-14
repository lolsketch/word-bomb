import { useEffect, useState } from "react";
import type { GameState, PlayerState } from "../../server/types";
import "./Room.css";
import { Player } from "./components/Player/Player";

interface Props {
  game: GameState;
  playerId: string;
}

interface Circle {
  radius: string;
  rotate: number;
  rotateReverse: number;
}

const buildCircle = (numPlayers: number): Circle[] => {
  const type = 1;
  let radius = "220"; //distance from center
  let start = -90; //shift start from 0
  let slice = (360 * type) / numPlayers;

  let items: Circle[] = [];
  let i;
  for (i = 0; i < numPlayers; i++) {
    let rotate = slice * i + start;
    let rotateReverse = rotate * -1;

    items.push({
      radius: radius,
      rotate: rotate,
      rotateReverse: rotateReverse,
    });
  }
  return items;
};

const rearrangePlayers = (
  players: [string, PlayerState][],
  playerIndex: number
) => {
  const playerAndAfter = players.slice(playerIndex);
  const playersBefore = players.slice(0, playerIndex);

  return [...playerAndAfter, ...playersBefore];
};

export const Room = ({ game, playerId }: Props) => {
  const [circle, setCircle] = useState<Circle[]>([]);
  const playerIds = Object.keys(game.players);
  const numPlayers = Object.keys(game.players).length;
  const rawPlayers = Object.entries(game.players);
  const playerIndex = playerIds.indexOf(playerId);
  const players = rearrangePlayers(rawPlayers, playerIndex);

  if (numPlayers === 0) {
    return <p>Waiting for players</p>;
  }

  useEffect(() => {
    if (numPlayers > 0) {
      const result = buildCircle(numPlayers);
      setCircle(result);
    }
  }, [numPlayers]);

  if (circle.length != numPlayers) {
    return;
  }

  return (
    <div className="container">
      <div className="container-item">
        {players.map(([id, playerState], index) => {
          return (
            <Player
              key={id}
              player={playerState}
              playersTurn={game.currentTurn === id}
              css={circle[index]}
            />
          );
        })}
      </div>
    </div>
  );
};
