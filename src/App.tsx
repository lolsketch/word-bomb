import { EnabledAnswerInput } from "./components/AnswerInput";
import "./globals.css";
import "./App.css";
import { useGame } from "./useGame";
import { Room } from "./components/Room";
import { Chat } from "./components/Chat";

function App() {
  const game = useGame();
  if (!game.game) {
    return "Game not found";
  }

  return (
    <div className="flex h-screen bg-blue-200">
      <div className="p-4 space-y-2 overflow-y-scroll bg-red-200 w-64 h-full">
        <Chat messages={game.game.messages} sendMessage={game.sendMessage} />
      </div>
      <div className="flex flex-col flex-grow">
        <header className="p-2 bg-blue-500 text-white">
          <h1>Porodle</h1>
        </header>
        <main className="p-4 h-full overflow-y-hidden">
          <Room game={game} playerId={game.playerId} />
        </main>
      </div>
    </div>
  );
}

export default App;
