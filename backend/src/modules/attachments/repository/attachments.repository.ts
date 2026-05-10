import { Attachment, Prisma } from "@prisma/client";
import prisma from "@/config/database";

export class AttachmentsRepository {
  async findByTripId(tripId: string): Promise<Attachment[]> {
    return prisma.attachment.findMany({
      where: { tripId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string): Promise<Attachment | null> {
    return prisma.attachment.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.AttachmentCreateUncheckedInput): Promise<Attachment> {
    return prisma.attachment.create({
      data,
    });
  }

  async delete(id: string): Promise<Attachment> {
    return prisma.attachment.delete({
      where: { id },
    });
  }
}

export const attachmentsRepository = new AttachmentsRepository();
