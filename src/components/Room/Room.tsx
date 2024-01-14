import { useEffect, useState } from "react";
import type { GameState } from "../../server/types";
import "./Room.css";
import { Player } from "./components/Player/Player";

interface Props {
  game: GameState;
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
  // this.setState({ square: items });
};

export const Room = ({ game }: Props) => {
  const [circle, setCircle] = useState<Circle[]>([]);
  const numPlayers = Object.keys(game.players).length;
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
        {Object.entries(game.players).map(([id, playerState], index) => {
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
