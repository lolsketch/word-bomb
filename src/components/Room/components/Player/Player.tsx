import type { PlayerState } from "../../../../server/types";
import poroImg from "./images/poro.jpeg";
import poroGhostImg from "./images/ghost-poro.png";
import snaxImg from "./images/snax.png";
import emptyHeartImg from "./images/heart-empty.png";
import fullHeartImg from "./images/heart-full.png";
import { MAX_LIVES } from "../../../../server/data/constants";
import s from "./Player.module.css";
import { useEffect, useRef } from "react";
import { usePrevious } from "@uidotdev/usehooks";
import { DisabledAnswerInput } from "../../../AnswerInput";

interface Props {
  player: PlayerState;
  playersTurn: boolean;
  css: any;
  typing: string;
}

export const Player = ({ player, playersTurn, css, typing }: Props) => {
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

  const ref = useRef<HTMLDivElement>(null);
  const prev = usePrevious(player.shake);
  useEffect(() => {
    if (prev === player.shake || player.shake === 0) {
      return;
    }

    ref.current!.style.animation = "none";
    ref.current!.offsetHeight; /* trigger reflow */
    ref.current!.style.animation = "";
  }, [player.shake]);

  return (
    <div
      className={"player"}
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
      <DisabledAnswerInput currentAnswer={typing} />
      <div ref={ref} className={player.shake > 0 ? s.shake : ""}>
        <div>
          <img src={getAvatar()} className="avatar" />
        </div>
        <div>
          {lives.map((value, index) => {
            const img = value ? fullHeartImg : emptyHeartImg;
            return <img key={index} width="20px" src={img} />;
          })}
        </div>
        {player.id}D
      </div>
    </div>
  );
};
