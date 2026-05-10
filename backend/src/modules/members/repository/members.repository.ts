import { TripMember, Prisma, MemberRole } from "@prisma/client";
import prisma from "@/config/database";

export class MembersRepository {
  async add(data: Prisma.TripMemberCreateUncheckedInput): Promise<TripMember> {
    return prisma.tripMember.create({
      data,
    });
  }

  async findByTripAndUser(tripId: string, userId: string): Promise<TripMember | null> {
    return prisma.tripMember.findUnique({
      where: {
        tripId_userId: {
          tripId,
          userId,
        },
      },
    });
  }

  async findById(id: string): Promise<TripMember | null> {
    return prisma.tripMember.findUnique({
      where: { id },
    });
  }

  async findByTrip(tripId: string): Promise<TripMember[]> {
    return prisma.tripMember.findMany({
      where: { tripId },
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
    });
  }

  async update(id: string, data: Prisma.TripMemberUpdateInput): Promise<TripMember> {
    return prisma.tripMember.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<TripMember> {
    return prisma.tripMember.delete({
      where: { id },
    });
  }
}

export const membersRepository = new MembersRepository();
