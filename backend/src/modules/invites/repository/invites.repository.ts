import { Invite, Prisma, InviteStatus, MemberRole } from "@prisma/client";
import prisma from "@/config/database";

export class InvitesRepository {
  async findByTripId(tripId: string): Promise<Invite[]> {
    return prisma.invite.findMany({
      where: { tripId },
      include: {
        inviter: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findPendingByEmail(email: string): Promise<Invite[]> {
    return prisma.invite.findMany({
      where: { email, status: InviteStatus.PENDING },
      include: {
        trip: {
          select: {
            title: true,
            destination: true,
          },
        },
        inviter: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<Invite | null> {
    return prisma.invite.findUnique({
      where: { id },
    });
  }

  async findByTripAndEmail(tripId: string, email: string): Promise<Invite | null> {
    return prisma.invite.findUnique({
      where: {
        tripId_email: {
          tripId,
          email,
        },
      },
    });
  }

  async create(data: Prisma.InviteCreateUncheckedInput): Promise<Invite> {
    return prisma.invite.create({
      data,
    });
  }

  async updateStatus(id: string, status: InviteStatus): Promise<Invite> {
    return prisma.invite.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: string): Promise<Invite> {
    return prisma.invite.delete({
      where: { id },
    });
  }

  async acceptInvite(inviteId: string, userId: string): Promise<void> {
    const invite = await this.findById(inviteId);
    if (!invite) return;

    await prisma.$transaction([
      prisma.invite.update({
        where: { id: inviteId },
        data: { status: InviteStatus.ACCEPTED },
      }),
      prisma.tripMember.create({
        data: {
          tripId: invite.tripId,
          userId: userId,
          role: invite.role,
        },
      }),
    ]);
  }
}

export const invitesRepository = new InvitesRepository();
