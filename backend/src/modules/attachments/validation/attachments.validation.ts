import { z } from "zod";

export const createAttachmentSchema = z.object({
  body: z.object({
    tripId: z.string().uuid(),
  }),
});
