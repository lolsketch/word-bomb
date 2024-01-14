import type { PlayerState } from "../../../../server/types";
import poroImg from "./images/poro.jpeg";
import poroGhostImg from "./images/ghost-poro.png";
import snaxImg from "./images/snax.png";
import emptyHeartImg from "./images/heart-empty.png";
import fullHeartImg from "./images/heart-full.png";
import { MAX_LIVES } from "../../../../server/data/constants";

interface Props {
  player: PlayerState;
  playersTurn: boolean;
  css: any;
}

export const Player = ({ player, playersTurn, css }: Props) => {
  const getAvatar = () => {
    if (player.lives <= 0) {
      return poroGhostImg;
    }
    if (playersTurn) {
      return poroImg;
    }
    return snaxImg;
  };
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
      <div>
        <img src={getAvatar()} className="avatar" />
      </div>
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
