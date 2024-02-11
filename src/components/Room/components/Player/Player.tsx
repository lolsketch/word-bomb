import type { PlayerState } from "../../../../server/types";
import poroImg from "./images/poro.jpeg";
import poroGhostImg from "./images/ghost-poro.png";
import victoryPoro from "./images/victory-poro.png";
import snaxImg from "./images/snax.png";
import emptyHeartImg from "./images/heart-empty.png";
import greyHeart from "./images/heart-grey.png";

import fullHeartImg from "./images/heart-full.png";
import { MAX_LIVES } from "../../../../server/data/constants";
import s from "./Player.module.css";
import { useEffect, useRef } from "react";
import { usePrevious } from "@uidotdev/usehooks";
import { DisabledAnswerInput } from "../../../AnswerInput";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

interface Props {
  player: PlayerState;
  playersTurn: boolean;
  css: any;
  typing: string;
  showLives: boolean;
  isMe: boolean;
  time: number;
}

export const Player = ({
  player,
  playersTurn,
  css,
  typing,
  showLives,
  isMe,
  time,
}: Props) => {
  const getAvatar = () => {
    if (player.lives > 0 && !showLives) {
      return victoryPoro;
    }

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

  const img = <img src={getAvatar()} className="avatar" />;

  const avatar = playersTurn ? (
    <CountdownCircleTimer
      isPlaying
      duration={time / 1000}
      colors={["#7cc75e", "#7cc75e", "#F7B801", "#FF0000"]}
      colorsTime={[10, 5, 2, 0]}
      size={105}
    >
      {() => <>{img}</>}
    </CountdownCircleTimer>
  ) : (
    img
  );

  return (
    <div
      className={"player flex flex-col items-center justify-center"}
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
      <div
        ref={ref}
        className={player.shake > 0 ? s.shake + " " + s.margin : s.margin}
      >
        {avatar}
        {showLives && (
          <div className="flex space-x-1 justify-center">
            {lives.map((value, index) => {
              if (player.hasGreyHealth && index === MAX_LIVES - player.lives) {
                return <img key={index} width="20px" src={greyHeart} />;
              }

              const img = value ? fullHeartImg : emptyHeartImg;
              return <img key={index} width="20px" src={img} />;
            })}
          </div>
        )}
        <div>
          {player.id} {isMe && "(you)"}
        </div>
      </div>
    </div>
  );
};
