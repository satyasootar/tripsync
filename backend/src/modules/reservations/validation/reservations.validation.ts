import { z } from "zod";
import { ReservationType } from "@prisma/client";

export const createReservationSchema = z.object({
  body: z.object({
    tripId: z.string().uuid(),
    type: z.nativeEnum(ReservationType),
    title: z.string().min(1),
    confirmationNo: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    location: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const updateReservationSchema = z.object({
  body: z.object({
    type: z.nativeEnum(ReservationType).optional(),
    title: z.string().min(1).optional(),
    confirmationNo: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    location: z.string().optional(),
    notes: z.string().optional(),
  }),
});
