export type Action = { action: "type"; value: string };

export type Update = { action: "typing"; value: string };

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
