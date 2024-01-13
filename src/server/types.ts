export type Action =
  | { action: "type"; value: string }
  | {
      action: "guess";
      value: string;
    }
  | { action: "start" };

export type Update =
  | { action: "typing"; value: string }
  | { action: "game"; value: GameState };

export type PlayerID = string;

export interface PlayerState {
  id: string;
  name: string;
  lives: number;
}

export interface GameState {
  id: string;
  players: { [id: string]: PlayerState };
  currentTurn: PlayerID | null;
  question: { question: string; answer: string[] } | null;
  typing: string;
}

export function createAction(action: Action): string {
  return JSON.stringify(action);
}

export function createUpdate(update: Update): string {
  return JSON.stringify(update);
}

export function parseAction(message: string): Action {
  return JSON.parse(message) as Action;
}

export function parseUpdate(message: string): Update {
  return JSON.parse(message) as Update;
}
