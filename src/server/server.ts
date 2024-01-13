import type * as Party from "partykit/server";
import { createUpdate, parseAction, type GameState } from "./types";

export default class Server implements Party.Server {
  options: Party.ServerOptions = { hibernate: false };
  constructor(readonly room: Party.Room) {}
  typing: string = "";
  game: GameState = { id: "", players: {}, currentTurn: null };

  async onStart() {
    this.typing = (await this.room.storage.get<string>("typing")) ?? "";
    this.game = (await this.room.storage.get<GameState>("game")) ?? this.game;
  }

  async onConnect(connection: Party.Connection) {
    console.log("Connection opened", connection.id);
    connection.send(createUpdate({ action: "typing", value: this.typing }));

    const player = this.game.players[connection.id];
    if (!player) {
      const newPlayer = {
        id: connection.id,
        lives: 3,
        name: "Poro",
      };
      this.game.players[connection.id] = newPlayer;
      await this.room.storage.put("game", this.game);
    }

    this.room.broadcast(
      createUpdate({
        action: "game",
        value: this.game,
      })
    );
  }

  onMessage(message: string, _sender: Party.Connection) {
    const parsed = parseAction(message);

    switch (parsed.action) {
      case "type":
        this.typing = parsed.value!;
        this.room.storage.put("typing", this.typing);
        this.room.broadcast(
          createUpdate({
            action: "typing",
            value: this.typing,
          })
        );
        break;
    }
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
}

Server satisfies Party.Worker;
