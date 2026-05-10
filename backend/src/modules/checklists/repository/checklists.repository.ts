import { Checklist, ChecklistItem, Prisma } from "@prisma/client";
import prisma from "@/config/database";

export class ChecklistsRepository {
  async findByTripId(tripId: string): Promise<Checklist[]> {
    return prisma.checklist.findMany({
      where: { tripId },
      include: {
        items: {
          orderBy: { position: "asc" },
          include: {
            assignee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async findById(id: string): Promise<Checklist | null> {
    return prisma.checklist.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { position: "asc" },
        },
      },
    });
  }

  async create(data: Prisma.ChecklistCreateUncheckedInput): Promise<Checklist> {
    return prisma.checklist.create({
      data,
      include: { items: true },
    });
  }

  async update(id: string, data: Prisma.ChecklistUpdateInput): Promise<Checklist> {
    return prisma.checklist.update({
      where: { id },
      data,
      include: { items: true },
    });
  }

  async delete(id: string): Promise<Checklist> {
    return prisma.checklist.delete({
      where: { id },
    });
  }

  // Checklist Item operations
  async createItem(data: Prisma.ChecklistItemCreateUncheckedInput): Promise<ChecklistItem> {
    return prisma.checklistItem.create({
      data,
    });
  }

  async updateItem(id: string, data: Prisma.ChecklistItemUpdateInput): Promise<ChecklistItem> {
    return prisma.checklistItem.update({
      where: { id },
      data,
    });
  }

  async deleteItem(id: string): Promise<ChecklistItem> {
    return prisma.checklistItem.delete({
      where: { id },
    });
  }

  async findItemById(id: string): Promise<ChecklistItem | null> {
    return prisma.checklistItem.findUnique({
      where: { id },
      include: {
        checklist: {
          select: { tripId: true },
        },
      },
    });
  }

  async updateItemPositions(updates: { id: string; position: number }[]): Promise<void> {
    await prisma.$transaction(
      updates.map((update) =>
        prisma.checklistItem.update({
          where: { id: update.id },
          data: { position: update.position },
        })
      )
    );
  }

  async countItemsByChecklistId(checklistId: string): Promise<number> {
    return prisma.checklistItem.count({
      where: { checklistId },
    });
  }
}

export const checklistsRepository = new ChecklistsRepository();
