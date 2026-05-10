import { Activity, Prisma } from "@prisma/client";
import prisma from "@/config/database";

export class ActivitiesRepository {
  async findByDayId(dayId: string): Promise<Activity[]> {
    return prisma.activity.findMany({
      where: { dayId },
      orderBy: { position: "asc" },
    });
  }

  async findById(id: string): Promise<Activity | null> {
    return prisma.activity.findUnique({
      where: { id },
      include: {
        day: {
          select: {
            tripId: true,
          },
        },
      },
    });
  }

  async create(data: Prisma.ActivityCreateUncheckedInput): Promise<Activity> {
    return prisma.activity.create({
      data,
    });
  }

  async update(id: string, data: Prisma.ActivityUpdateInput): Promise<Activity> {
    return prisma.activity.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Activity> {
    return prisma.activity.delete({
      where: { id },
    });
  }

  async updatePositions(updates: { id: string; position: number }[]): Promise<void> {
    await prisma.$transaction(
      updates.map((update) =>
        prisma.activity.update({
          where: { id: update.id },
          data: { position: update.position },
        })
      )
    );
  }

  async countByDayId(dayId: string): Promise<number> {
    return prisma.activity.count({
      where: { dayId },
    });
  }
}

export const activitiesRepository = new ActivitiesRepository();
