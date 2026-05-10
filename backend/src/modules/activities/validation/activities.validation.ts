import { z } from "zod";
import { ActivityStatus } from "@prisma/client";

export const createActivitySchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    startTime: z.string().datetime().optional(),
    endTime: z.string().datetime().optional(),
    location: z.string().optional(),
    status: z.nativeEnum(ActivityStatus).optional(),
    position: z.number().int().min(0).optional(),
  }),
});

export const updateActivitySchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    startTime: z.string().datetime().optional(),
    endTime: z.string().datetime().optional(),
    location: z.string().optional(),
    status: z.nativeEnum(ActivityStatus).optional(),
    position: z.number().int().min(0).optional(),
  }),
});

export const reorderActivitiesSchema = z.object({
  body: z.object({
    activities: z.array(
      z.object({
        id: z.string().uuid(),
        position: z.number().int().min(0),
      })
    ),
  }),
});
