import { Comment, Prisma } from "@prisma/client";
import prisma from "@/config/database";

export class CommentsRepository {
  async findByDayId(dayId: string): Promise<Comment[]> {
    return prisma.comment.findMany({
      where: { dayId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async findByActivityId(activityId: string): Promise<Comment[]> {
    return prisma.comment.findMany({
      where: { activityId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async findById(id: string): Promise<Comment | null> {
    return prisma.comment.findUnique({
      where: { id },
      include: {
        day: { select: { tripId: true } },
        activity: { include: { day: { select: { tripId: true } } } },
      },
    });
  }

  async create(data: Prisma.CommentCreateUncheckedInput): Promise<Comment> {
    return prisma.comment.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.CommentUpdateInput): Promise<Comment> {
    return prisma.comment.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<Comment> {
    return prisma.comment.delete({
      where: { id },
    });
  }
}

export const commentsRepository = new CommentsRepository();
