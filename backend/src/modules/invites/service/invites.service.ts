import { Invite, InviteStatus, MemberRole } from "@prisma/client";
import { invitesRepository, InvitesRepository } from "../repository/invites.repository";
import { tripsRepository, TripsRepository } from "@/modules/trips/repository/trips.repository";
import { membersRepository, MembersRepository } from "@/modules/members/repository/members.repository";
import { usersRepository } from "@/modules/users/repository/users.repository";
import { NotFoundError, AuthorizationError, ConflictError } from "@/common/errors";

export class InvitesService {
  constructor(
    private readonly repository: InvitesRepository = invitesRepository,
    private readonly tripRepo: TripsRepository = tripsRepository,
    private readonly memberRepo: MembersRepository = membersRepository
  ) {}

  async sendInvite(userId: string, data: any) {
    const trip = await this.tripRepo.findById(data.tripId);
    if (!trip) throw new NotFoundError("Trip");

    // Check if requester is OWNER or ADMIN
    const requesterMember = await this.memberRepo.findByTripAndUser(data.tripId, userId);
    if (!requesterMember || (requesterMember.role !== MemberRole.OWNER && requesterMember.role !== "ADMIN" as any)) {
      throw new AuthorizationError("Only trip owners or admins can send invites");
    }

    // Check if already a member
    const userToInvite = await usersRepository.findByEmail(data.email);
    if (userToInvite) {
        const existingMember = await this.memberRepo.findByTripAndUser(data.tripId, userToInvite.id);
        if (existingMember) throw new ConflictError("User is already a member of this trip");
    }

    // Check if invite already exists
    const existingInvite = await this.repository.findByTripAndEmail(data.tripId, data.email);
    if (existingInvite && existingInvite.status === InviteStatus.PENDING) {
      throw new ConflictError("An invite is already pending for this email");
    }

    return this.repository.create({
      ...data,
      inviterId: userId,
    });
  }

  async respondToInvite(inviteId: string, userId: string, userEmail: string, accept: boolean) {
    const invite = await this.repository.findById(inviteId);
    if (!invite) throw new NotFoundError("Invite");

    if (invite.email !== userEmail) {
      throw new AuthorizationError("This invite was not sent to your email");
    }

    if (invite.status !== InviteStatus.PENDING) {
      throw new ConflictError("Invite has already been processed");
    }

    if (accept) {
      await this.repository.acceptInvite(inviteId, userId);
      return { status: InviteStatus.ACCEPTED };
    } else {
      await this.repository.updateStatus(inviteId, InviteStatus.DECLINED);
      return { status: InviteStatus.DECLINED };
    }
  }

  async getTripInvites(tripId: string, userId: string) {
    const requesterMember = await this.memberRepo.findByTripAndUser(tripId, userId);
    if (!requesterMember) throw new AuthorizationError("Not a member of this trip");

    return this.repository.findByTripId(tripId);
  }

  async getMyPendingInvites(userEmail: string) {
    return this.repository.findPendingByEmail(userEmail);
  }
}

export const invitesService = new InvitesService();
