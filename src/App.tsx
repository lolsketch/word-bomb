import { AnswerInput } from "./components/AnswerInput";
import "./App.css";
import { useGame } from "./useGame";
import { Room } from "./components/Room";

function App() {
  const game = useGame();
  if (!game.game) {
    return "Game not found";
  }

  return (
    <>
      <h1>Porodle</h1>
      <Room game={game.game} />
      <div className="card">
        <p>{game.game.question?.question}</p>
        <AnswerInput
          game={game}
          onTypeAnswer={game.onTypeAnswer}
          currentAnswer={game.currentAnswer}
        />
      </div>
      <button onClick={game.start}>Start</button>
    </>
  );
}

export default App;
