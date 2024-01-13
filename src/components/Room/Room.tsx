import { useGame } from "../../useGame";
import "./Room.css";

export const Room = () => {
  const { game } = useGame();
  if (!game) {
    return <p>Game not found</p>;
  }

  return (
    <>
      {Object.entries(game.players).map(([id, playerState]) => {
        return <p>Player {id} - Lives: {playerState.lives}</p>;
      })}
    </>
  );
};
