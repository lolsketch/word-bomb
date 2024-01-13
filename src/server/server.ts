import type * as Party from "partykit/server";
import { createUpdate, parseAction } from "./types";

export default class Server implements Party.Server {
  options: Party.ServerOptions = { hibernate: false };
  constructor(readonly party: Party.Party) {}
  typing: string = "";

  async onStart() {
    // Load counter from storage on startup
    this.typing = (await this.party.storage.get<string>("typing")) ?? "";
  }

  onConnect(connection: Party.Connection) {
    // For all WebSocket connections, send the current count
    connection.send(createUpdate({ action: "typing", value: this.typing }));
  }

  onMessage(message: string, _sender: Party.Connection) {
    // For all WebSocket messages, parse the message and update the count

    const parsed = parseAction(message);

    switch (parsed.action) {
      case "type":
        this.typing = parsed.value!;
        this.party.storage.put("typing", this.typing);
        this.party.broadcast(
          createUpdate({
            action: "typing",
            value: this.typing,
          })
        );
        break;
    }
  }
}

Server satisfies Party.Worker;
