import { useEffect, useRef, useState } from "react";
import type { Game } from "../useGame";
import css from "./AnswerInput.module.css";
interface Props {
  onTypeAnswer: (answer: string) => void;
  currentAnswer: string;
  game: Game;
}

export const AnswerInput = ({ onTypeAnswer, currentAnswer, game }: Props) => {
  if (game.myTurn) {
    return (
      <EnabledAnswerInput
        game={game}
        onTypeAnswer={onTypeAnswer}
        currentAnswer={currentAnswer}
      />
    );
  } else {
    return <DisabledAnswerInput currentAnswer={currentAnswer} />;
  }
};

function EnabledAnswerInput({ onTypeAnswer, game }: Props) {
  const [localAnswer, setLocalAnswer] = useState("");

  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        game.onGuess(localAnswer);
      }}
    >
      <input
        className={css.input}
        ref={ref}
        onChange={(e) => {
          setLocalAnswer(e.target.value);
          onTypeAnswer(e.target.value);
        }}
        value={localAnswer}
      />
    </form>
  );
}

function DisabledAnswerInput({ currentAnswer }: Pick<Props, "currentAnswer">) {
  return (
    <div>
      <input className={css.input} disabled value={currentAnswer}></input>
    </div>
  );
}
