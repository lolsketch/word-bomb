import type { GameState } from "../../server/types";
import "./Room.css";

interface Props {
  game: GameState;
}

export const Room = ({ game }: Props) => {
  return (
    <>
      {Object.entries(game.players).map(([id, playerState]) => {
        return (
          <p key={id}>
            Player {id} - Lives: {playerState.lives}
          </p>
        );
      })}
    </>
  );
};
