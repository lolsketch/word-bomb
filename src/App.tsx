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
        <AnswerInput
          onTypeAnswer={game.onTypeAnswer}
          currentAnswer={game.currentAnswer}
        />
      </div>
    </>
  );
}

export default App;
