import type { GameState } from "../../server/types";
import "./Room.css";
import { Player } from "./components/Player/Player";

interface Props {
  game: GameState;
}

export const Room = ({ game }: Props) => {
  if (Object.keys(game.players).length === 0) {
    return <p>Waiting for players</p>;
  }

  return (
    <div className="container">
      {Object.entries(game.players).map(([id, playerState]) => {
        return (
          <Player player={playerState} playersTurn={game.currentTurn === id} />
        );
      })}
    </div>
  );
};
