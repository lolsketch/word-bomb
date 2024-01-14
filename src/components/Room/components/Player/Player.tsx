import type { PlayerState } from "../../../../server/types";
import poroImg from "./images/poro.jpeg";
import snaxImg from "./images/snax.png";
import emptyHeartImg from "./images/heart-empty.png";
import fullHeartImg from "./images/heart-full.png";

interface Props {
  player: PlayerState;
  playersTurn: boolean;
  css: any;
}

const MAX_LIVES = 3;
export const Player = ({ player, playersTurn, css }: Props) => {
  const avatar = playersTurn ? (
    <img src={poroImg} alt="poro" className="avatar" />
  ) : (
    <img src={snaxImg} alt="snax" className="avatar" />
  );
  const lives = [...Array(MAX_LIVES)].fill(true, MAX_LIVES - player.lives);

  return (
    <div
      className="player"
      style={{
        transform:
          "rotate(" +
          css.rotate +
          "deg) translate(" +
          css.radius +
          "px) rotate(" +
          css.rotateReverse +
          "deg)",
      }}
    >
      <div>{avatar}</div>
      <div>
        {lives.map((value, index) => {
          const img = value ? fullHeartImg : emptyHeartImg;
          return <img key={index} width="20px" src={img} />;
        })}
      </div>
      Player {player.id}
    </div>
  );
};
