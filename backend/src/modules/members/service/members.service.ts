import { MemberRole, Prisma } from "@prisma/client";
import { membersRepository, MembersRepository } from "../repository/members.repository";
import { AuthorizationError, NotFoundError, ConflictError } from "@/common/errors";

export class MembersService {
  constructor(private readonly repository: MembersRepository = membersRepository) {}

  async addMember(data: Prisma.MemberCreateUncheckedInput, requesterId: string) {
    // Check if requester is OWNER or ADMIN of the trip
    const requesterMember = await this.repository.findByTripAndUser(data.tripId, requesterId);
    if (!requesterMember || (requesterMember.role !== MemberRole.OWNER && requesterMember.role !== MemberRole.ADMIN)) {
      throw new AuthorizationError("Only trip owners or admins can add members");
    }

    // Check if user is already a member
    const existingMember = await this.repository.findByTripAndUser(data.tripId, data.userId);
    if (existingMember) {
      throw new ConflictError("User is already a member of this trip");
    }

    return this.repository.add(data);
  }

  async getTripMembers(tripId: string) {
    return this.repository.findByTrip(tripId);
  }

  async updateMemberRole(memberId: string, role: MemberRole, requesterId: string) {
    const member = await this.repository.findById(memberId);
    if (!member) {
      throw new NotFoundError("Member");
    }

    // Check requester permissions
    const requesterMember = await this.repository.findByTripAndUser(member.tripId, requesterId);
    if (!requesterMember || (requesterMember.role !== MemberRole.OWNER && requesterMember.role !== MemberRole.ADMIN)) {
      throw new AuthorizationError("Insufficient permissions to update roles");
    }

    // Prevent changing OWNER role or changing to OWNER role
    if (member.role === MemberRole.OWNER || role === MemberRole.OWNER) {
      throw new AuthorizationError("Cannot change owner role");
    }

    return this.repository.update(memberId, { role });
  }

  async removeMember(memberId: string, requesterId: string) {
    const member = await this.repository.findById(memberId);
    if (!member) {
      throw new NotFoundError("Member");
    }

    const requesterMember = await this.repository.findByTripAndUser(member.tripId, requesterId);
    if (!requesterMember) {
      throw new AuthorizationError("Not a member of this trip");
    }

    // Self-removal is allowed, otherwise need OWNER/ADMIN
    if (member.userId !== requesterId) {
      if (requesterMember.role !== MemberRole.OWNER && requesterMember.role !== MemberRole.ADMIN) {
        throw new AuthorizationError("Only owners or admins can remove other members");
      }
      if (member.role === MemberRole.OWNER) {
        throw new AuthorizationError("Cannot remove the trip owner");
      }
    }

    return this.repository.delete(memberId);
  }
}

export const membersService = new MembersService();
