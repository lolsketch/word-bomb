import type * as Party from "partykit/server";
import { createUpdate, parseAction, type GameState } from "./types";
import {
  checkGameOver,
  nextTurn,
  pickQuestion,
  startGame,
} from "./models/Game";
import { MAX_GUESS_TIME, STARTING_WEIGHTS } from "./data/constants";
import { answers } from "./data/levels_lol";

export default class Server implements Party.Server {
  options: Party.ServerOptions = { hibernate: false };
  constructor(readonly room: Party.Room) {}
  game: GameState = {
    id: "",
    players: {},
    typing: "",
    currentTurn: null,
    question: null,
    timer: null,
    messages: [],
    usedWords: [],
    timerDuration: MAX_GUESS_TIME,
    difficultyWeights: { ...STARTING_WEIGHTS },
  };

  async onStart() {
    // reset state for now this.game = (await this.room.storage.get<GameState>("game")) ?? this.game;
    this.room.storage.put("game", this.game);
  }

  async onConnect(connection: Party.Connection) {
    console.log("Connection opened", connection.id);

    const player = this.game.players[connection.id];
    if (!player) {
      const newPlayer = {
        id: connection.id,
        lives: 0,
        name: "Poro",
        playersTurn: false,
        shake: 0,
      };
      this.game.players[connection.id] = newPlayer;
    }

    this.sync();
  }

  onMessage(message: string, sender: Party.Connection) {
    const parsed = parseAction(message);

    switch (parsed.action) {
      case "type":
        this.game.typing = parsed.value!;
        break;
      case "guess":
        const guess = parsed.value;

        if (this.game.usedWords.includes(guess)) {
          this.game.players[sender.id].shake++;
          // todo: make it obvious that word has been used
        } else if (
          guess.includes(this.game.question?.question || "err") &&
          answers.has(guess)
        ) {
          console.log("Correct guess!");
          pickQuestion(this.game);
          clearTimeout(this.game.timer!);
          nextTurn(this.game, () => this.sync());
          this.game.typing = "";
          this.game.usedWords.push(guess);
        } else {
          this.game.players[sender.id].shake++;
        }
        break;
      case "start":
        if (this.game.currentTurn) return;
        startGame(this.game, () => this.sync());
        break;
      case "message":
        this.game.messages.push(`${sender.id}: ${parsed.value!}`);
        break;
    }

    this.sync();
  }

  async onClose(connection: Party.Connection) {
    console.log("Connection closed", connection.id);

    delete this.game.players[connection.id];
    await this.room.storage.put("game", this.game);

    checkGameOver(this.game);

    this.room.broadcast(
      createUpdate({
        action: "game",
        value: this.game,
      })
    );
  }

  private async sync() {
    this.room.broadcast(
      createUpdate({
        action: "game",
        value: this.game,
      })
    );
    await this.room.storage.put("game", this.game);
  }
}

Server satisfies Party.Worker;
