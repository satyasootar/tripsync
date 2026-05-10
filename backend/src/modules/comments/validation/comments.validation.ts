import { z } from "zod";

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1),
    dayId: z.string().uuid().optional(),
    activityId: z.string().uuid().optional(),
  }).refine(data => data.dayId || data.activityId, {
    message: "Either dayId or activityId must be provided",
  }),
});

export const updateCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1),
  }),
});
