interface Props {
  onTypeAnswer: (answer: string) => void;
  currentAnswer: string;
}

export const AnswerInput = ({ onTypeAnswer, currentAnswer }: Props) => {
  return (
    <div>
      <input
        onChange={(e) => onTypeAnswer(e.target.value)}
        value={currentAnswer}
      ></input>
    </div>
  );
};
