import { useEffect, useRef, useState } from "react";
import type { Game } from "../useGame";
import css from "./AnswerInput.module.css";
interface Props {
  onTypeAnswer: (answer: string) => void;
  currentAnswer: string;
  game: Game;
}

export function EnabledAnswerInput({ onTypeAnswer, game }: Props) {
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
        onBlur={() => {
          ref.current?.focus();
        }}
        onChange={(e) => {
          setLocalAnswer(e.target.value);
          onTypeAnswer(e.target.value);
        }}
        value={localAnswer}
      />
    </form>
  );
}

export function DisabledAnswerInput({
  currentAnswer,
}: Pick<Props, "currentAnswer">) {
  return (
    <div>
      <input className={css.input} disabled value={currentAnswer}></input>
    </div>
  );
}
