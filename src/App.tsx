import { AnswerInput } from "./components/AnswerInput";
import { getPostId } from "./utils";
// import reactLogo from "./assets/react.svg";
// import partyKitLogo from "./assets/partykit.png";
// import viteLogo from "/vite.svg";
import "./App.css";
import { useGame } from "./useGame";

function App() {
  const game = useGame();

  return (
    <>
      <h1>Porodle</h1>
      <div className="card">
        <AnswerInput
          onTypeAnswer={game.onTypeAnswer}
          currentAnswer={game.currentAnswer}
        />
      </div>

      <p className="read-the-docs"></p>
    </>
  );
}

export default App;
