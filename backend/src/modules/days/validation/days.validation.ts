import { z } from "zod";

export const createDaySchema = z.object({
  body: z.object({
    date: z.string().datetime(),
    position: z.number().int().min(0).optional(),
  }),
});

export const updateDaySchema = z.object({
  body: z.object({
    date: z.string().datetime().optional(),
    position: z.number().int().min(0).optional(),
  }),
});

export const reorderDaysSchema = z.object({
  body: z.object({
    days: z.array(
      z.object({
        id: z.string().uuid(),
        position: z.number().int().min(0),
      })
    ),
  }),
});
