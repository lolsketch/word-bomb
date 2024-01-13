import type * as Party from "partykit/server";
import { createUpdate, parseAction, type GameState } from "./types";
import { nextTurn, pickQuestion, startGame } from "./models/Game";

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
      };
      this.game.players[connection.id] = newPlayer;
    }

    this.sync();
  }

  onMessage(message: string, _sender: Party.Connection) {
    const parsed = parseAction(message);

    switch (parsed.action) {
      case "type":
        this.game.typing = parsed.value!;
        break;
      case "guess":
        const guess = parsed.value;

        if (this.game.question?.answer.includes(guess)) {
          console.log("Correct guess!");
          pickQuestion(this.game);
          nextTurn(this.game, () => this.sync());
          this.game.typing = "";
          clearTimeout(this.game.timer!);
        }
        break;
      case "start":
        startGame(this.game, () => this.sync());
        break;
    }

    this.sync();
  }

  async onClose(connection: Party.Connection) {
    console.log("Connection closed", connection.id);

    delete this.game.players[connection.id];
    await this.room.storage.put("game", this.game);

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
