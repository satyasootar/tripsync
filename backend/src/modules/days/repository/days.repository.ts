import { Day, Prisma } from "@prisma/client";
import prisma from "@/config/database";

export class DaysRepository {
  async findByTripId(tripId: string): Promise<Day[]> {
    return prisma.day.findMany({
      where: { tripId },
      orderBy: { position: "asc" },
      include: {
        activities: {
          orderBy: { position: "asc" },
        },
      },
    });
  }

  async findById(id: string): Promise<Day | null> {
    return prisma.day.findUnique({
      where: { id },
      include: {
        activities: {
          orderBy: { position: "asc" },
        },
      },
    });
  }

  async create(data: Prisma.DayCreateUncheckedInput): Promise<Day> {
    return prisma.day.create({
      data,
    });
  }

  async update(id: string, data: Prisma.DayUpdateInput): Promise<Day> {
    return prisma.day.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Day> {
    return prisma.day.delete({
      where: { id },
    });
  }

  async updatePositions(updates: { id: string; position: number }[]): Promise<void> {
    await prisma.$transaction(
      updates.map((update) =>
        prisma.day.update({
          where: { id: update.id },
          data: { position: update.position },
        })
      )
    );
  }

  async countByTripId(tripId: string): Promise<number> {
    return prisma.day.count({
      where: { tripId },
    });
  }
}

export const daysRepository = new DaysRepository();
