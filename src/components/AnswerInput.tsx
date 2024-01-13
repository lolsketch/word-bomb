import type { Game } from "../useGame";

interface Props {
  onTypeAnswer: (answer: string) => void;
  currentAnswer: string;
  game: Game;
}

export const AnswerInput = ({ onTypeAnswer, currentAnswer, game }: Props) => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        game.onGuess(currentAnswer);
      }}
    >
      <input
        onChange={(e) => onTypeAnswer(e.target.value)}
        value={currentAnswer}
      ></input>
    </form>
  );
};
