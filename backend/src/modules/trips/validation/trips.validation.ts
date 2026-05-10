import { z } from "zod";
import { TripVisibility } from "@prisma/client";

export const createTripSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100),
    description: z.string().max(500).optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    destination: z.string().min(2),
    visibility: z.nativeEnum(TripVisibility).optional(),
  }),
});

export const updateTripSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100).optional(),
    description: z.string().max(500).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    destination: z.string().min(2).optional(),
    visibility: z.nativeEnum(TripVisibility).optional(),
  }),
});
