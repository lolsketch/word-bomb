import type * as Party from "partykit/server";
import { createUpdateMessage, parseActionMessage, ActionSchema } from "./types";
import { z } from "zod";
const json = (response: string) =>
  new Response(response, {
    headers: {
      "Content-Type": "application/json",
    },
  });

export default class Server implements Party.Server {
  options: Party.ServerOptions = { hibernate: false };
  constructor(readonly party: Party.Party) {}
  count: number = 0;
  typing: string = "";

  async onStart() {
    // Load counter from storage on startup
    this.count = (await this.party.storage.get<number>("count")) ?? 0;
    this.typing = (await this.party.storage.get<string>("typing")) ?? "";
  }

  async onRequest() {
    // For all HTTP request, respond with the current count
    return json(createUpdateMessage(this.count));
  }

  onConnect(connection: Party.Connection) {
    // For all WebSocket connections, send the current count
    connection.send(createUpdateMessage(this.count));
  }

  onMessage(message: string, sender: Party.Connection) {
    // For all WebSocket messages, parse the message and update the count

    const parsed = parseActionMessage(message);
    this.updateAndBroadcastCount(parsed.action);

    if (parsed.action === "type") {
      this.typing = parsed.value!;
      this.party.storage.put("typing", this.typing);
      this.party.broadcast(
        JSON.stringify({
          type: "typing",
          payload: this.typing,
        })
      );
    }
  }

  updateAndBroadcastCount(action: z.infer<typeof ActionSchema>["action"]) {
    // Update stored count
    if (action === "upvote") this.count++;
    else if (action === "downvote") this.count--;

    // Send updated count to all connected listeners
    this.party.broadcast(createUpdateMessage(this.count));
    // Store updated count
    this.party.storage.put("count", this.count);
  }
}

Server satisfies Party.Worker;
