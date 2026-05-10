import { z } from "zod";
import { SplitType } from "@prisma/client";

export const createExpenseSchema = z.object({
  body: z.object({
    tripId: z.string().uuid(),
    amount: z.number().positive(),
    currency: z.string().length(3).optional(),
    description: z.string().min(1),
    date: z.string().datetime().optional(),
    paidById: z.string().uuid(),
    splitType: z.nativeEnum(SplitType).optional(),
    participants: z.array(
      z.object({
        userId: z.string().uuid(),
        amount: z.number().positive(),
      })
    ),
  }),
});

export const updateExpenseSchema = z.object({
  body: z.object({
    amount: z.number().positive().optional(),
    currency: z.string().length(3).optional(),
    description: z.string().min(1).optional(),
    date: z.string().datetime().optional(),
    paidById: z.string().uuid().optional(),
    splitType: z.nativeEnum(SplitType).optional(),
    participants: z.array(
      z.object({
        userId: z.string().uuid(),
        amount: z.number().positive(),
      })
    ).optional(),
  }),
});
