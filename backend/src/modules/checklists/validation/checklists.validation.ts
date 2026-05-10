import { z } from "zod";
import { ChecklistType } from "@prisma/client";

export const createChecklistSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    type: z.nativeEnum(ChecklistType).optional(),
    tripId: z.string().uuid(),
  }),
});

export const updateChecklistSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    type: z.nativeEnum(ChecklistType).optional(),
  }),
});

export const createChecklistItemSchema = z.object({
  body: z.object({
    content: z.string().min(1),
    assignedTo: z.string().uuid().optional(),
    position: z.number().int().min(0).optional(),
  }),
});

export const updateChecklistItemSchema = z.object({
  body: z.object({
    content: z.string().min(1).optional(),
    isCompleted: z.boolean().optional(),
    assignedTo: z.string().uuid().nullable().optional(),
    position: z.number().int().min(0).optional(),
  }),
});

export const reorderChecklistItemsSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        id: z.string().uuid(),
        position: z.number().int().min(0),
      })
    ),
  }),
});
