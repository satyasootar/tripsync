import { z } from "zod";
import { MemberRole } from "@prisma/client";

export const createInviteSchema = z.object({
  body: z.object({
    tripId: z.string().uuid(),
    email: z.string().email(),
    role: z.nativeEnum(MemberRole).optional(),
  }),
});

export const respondInviteSchema = z.object({
  body: z.object({
    accept: z.boolean(),
  }),
});
