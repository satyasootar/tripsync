import { z } from "zod";
import { MemberRole } from "@prisma/client";

export const addMemberSchema = z.object({
  body: z.object({
    tripId: z.string().uuid(),
    userId: z.string().uuid(),
    role: z.nativeEnum(MemberRole).optional(),
  }),
});

export const updateMemberRoleSchema = z.object({
  body: z.object({
    role: z.nativeEnum(MemberRole),
  }),
});
