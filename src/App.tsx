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
      <Room game={game.game} playerId={game.playerId} />
      <div className="card">
        <AnswerInput
          game={game}
          onTypeAnswer={game.onTypeAnswer}
          currentAnswer={game.currentAnswer}
        />
      </div>
      <div className="center">
        {!game.game.currentTurn && <button onClick={game.start}>Start</button>}
        <p className="question">{game.game.question?.question}</p>
      </div>
    </>
  );
}

export default App;
