import { AnswerInput } from "./components/AnswerInput";
import { getPostId } from "./utils";
// import reactLogo from "./assets/react.svg";
// import partyKitLogo from "./assets/partykit.png";
// import viteLogo from "/vite.svg";
import "./App.css";
import { useGame } from "./useGame";
import { Room } from "./components/Room";

function App() {
  const game = useGame();

  return (
    <>
    <h1>Porodle</h1>
    <Room />
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
