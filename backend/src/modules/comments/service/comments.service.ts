import { Comment, Prisma } from "@prisma/client";
import { commentsRepository, CommentsRepository } from "../repository/comments.repository";
import { daysRepository, DaysRepository } from "@/modules/days/repository/days.repository";
import { activitiesRepository, ActivitiesRepository } from "@/modules/activities/repository/activities.repository";
import { tripsRepository, TripsRepository } from "@/modules/trips/repository/trips.repository";
import { NotFoundError, AuthorizationError, BadRequestError } from "@/common/errors";

export class CommentsService {
  constructor(
    private readonly repository: CommentsRepository = commentsRepository,
    private readonly dayRepo: DaysRepository = daysRepository,
    private readonly activityRepo: ActivitiesRepository = activitiesRepository,
    private readonly tripRepo: TripsRepository = tripsRepository
  ) {}

  private async validateTripAccess(tripId: string, userId: string) {
    const trip = await this.tripRepo.findById(tripId);
    if (!trip) throw new NotFoundError("Trip");

    const isMember = (trip as any).members.some((m: any) => m.userId === userId);
    if (!isMember) throw new AuthorizationError("You are not a member of this trip");
  }

  async getCommentsByDay(dayId: string, userId: string) {
    const day = await this.dayRepo.findById(dayId);
    if (!day) throw new NotFoundError("Day");
    await this.validateTripAccess(day.tripId, userId);
    return this.repository.findByDayId(dayId);
  }

  async getCommentsByActivity(activityId: string, userId: string) {
    const activity = await this.activityRepo.findById(activityId);
    if (!activity) throw new NotFoundError("Activity");
    await this.validateTripAccess(activity.day.tripId, userId);
    return this.repository.findByActivityId(activityId);
  }

  async createComment(userId: string, data: any) {
    let tripId: string;
    if (data.dayId) {
      const day = await this.dayRepo.findById(data.dayId);
      if (!day) throw new NotFoundError("Day");
      tripId = day.tripId;
    } else if (data.activityId) {
      const activity = await this.activityRepo.findById(data.activityId);
      if (!activity) throw new NotFoundError("Activity");
      tripId = activity.day.tripId;
    } else {
      throw new BadRequestError("Either dayId or activityId must be provided");
    }

    await this.validateTripAccess(tripId, userId);

    return this.repository.create({
      ...data,
      userId,
    });
  }

  async updateComment(id: string, userId: string, content: string) {
    const comment = await this.repository.findById(id);
    if (!comment) throw new NotFoundError("Comment");
    if (comment.userId !== userId) throw new AuthorizationError("You can only edit your own comments");

    return this.repository.update(id, { content });
  }

  async deleteComment(id: string, userId: string) {
    const comment = await this.repository.findById(id);
    if (!comment) throw new NotFoundError("Comment");
    
    // Allow owner or the commenter to delete
    if (comment.userId !== userId) {
        let tripId: string = comment.day?.tripId || comment.activity?.day.tripId || "";
        const trip = await this.tripRepo.findById(tripId);
        if (trip?.ownerId !== userId) {
            throw new AuthorizationError("You don't have permission to delete this comment");
        }
    }

    return this.repository.delete(id);
  }
}

export const commentsService = new CommentsService();
