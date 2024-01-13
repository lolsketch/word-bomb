import z from "zod";

const allowedActions = ["upvote", "downvote", "type"] as const;
const allowedActionsSchema = z.enum(allowedActions);

// Client sends a message either via WebSocket or HTTP
// { type: "action", kind: "upvote" }
export const ActionSchema = z.object({
  type: z.literal("action"),
  action: allowedActionsSchema,
  value: z.string().optional(),
});

// Server responds with an updated count of votes
// { type: "update", count: 1 }
const UpdateSchema = z.object({
  type: z.literal("update"),
  count: z.number(),
});

export const parseActionMessage = (message: string) => {
  return ActionSchema.parse(JSON.parse(message));
};

export const createActionMessage = (action: string) => {
  return JSON.stringify(
    ActionSchema.parse({
      type: "action",
      action,
    })
  );
};

export const parseUpdateMessage = (message: string) => {
  return UpdateSchema.parse(JSON.parse(message));
};

export const createUpdateMessage = (count: number) => {
  return JSON.stringify(
    UpdateSchema.parse({
      type: "update",
      count,
    })
  );
};
