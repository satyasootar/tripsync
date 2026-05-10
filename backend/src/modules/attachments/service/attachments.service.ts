import { Attachment, Prisma } from "@prisma/client";
import { attachmentsRepository, AttachmentsRepository } from "../repository/attachments.repository";
import { tripsRepository, TripsRepository } from "@/modules/trips/repository/trips.repository";
import { NotFoundError, AuthorizationError } from "@/common/errors";
import fs from "fs";
import path from "path";

export class AttachmentsService {
  constructor(
    private readonly repository: AttachmentsRepository = attachmentsRepository,
    private readonly tripRepo: TripsRepository = tripsRepository
  ) {}

  private async validateTripAccess(tripId: string, userId: string) {
    const trip = await this.tripRepo.findById(tripId);
    if (!trip) throw new NotFoundError("Trip");

    const isMember = (trip as any).members.some((m: any) => m.userId === userId);
    if (!isMember) throw new AuthorizationError("You are not a member of this trip");
    return trip;
  }

  async getAttachments(tripId: string, userId: string) {
    await this.validateTripAccess(tripId, userId);
    return this.repository.findByTripId(tripId);
  }

  async createAttachment(userId: string, tripId: string, file: Express.Multer.File) {
    await this.validateTripAccess(tripId, userId);

    return this.repository.create({
      tripId,
      name: file.originalname,
      url: file.path,
      type: file.mimetype,
      size: file.size,
    });
  }

  async deleteAttachment(id: string, userId: string) {
    const attachment = await this.repository.findById(id);
    if (!attachment) throw new NotFoundError("Attachment");
    await this.validateTripAccess(attachment.tripId, userId);

    // Delete file from disk
    if (fs.existsSync(attachment.url)) {
      fs.unlinkSync(attachment.url);
    }

    return this.repository.delete(id);
  }
}

export const attachmentsService = new AttachmentsService();
