import { Trip, Prisma, MemberRole } from "@prisma/client";
import prisma from "@/config/database";

export class TripsRepository {
  async create(data: Prisma.TripCreateInput, userId: string): Promise<Trip> {
    return prisma.trip.create({
      data: {
        ...data,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: MemberRole.OWNER,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<Trip | null> {
    return prisma.trip.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
  }

  async findAllByUser(userId: string): Promise<Trip[]> {
    return prisma.trip.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    });
  }

  async update(id: string, data: Prisma.TripUpdateInput): Promise<Trip> {
    return prisma.trip.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Trip> {
    return prisma.trip.delete({
      where: { id },
    });
  }
}

export const tripsRepository = new TripsRepository();
