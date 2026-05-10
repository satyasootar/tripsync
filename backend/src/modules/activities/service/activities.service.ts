import { Activity, Prisma } from "@prisma/client";
import { activitiesRepository, ActivitiesRepository } from "../repository/activities.repository";
import { daysRepository, DaysRepository } from "@/modules/days/repository/days.repository";
import { tripsRepository, TripsRepository } from "@/modules/trips/repository/trips.repository";
import { NotFoundError, AuthorizationError } from "@/common/errors";

export class ActivitiesService {
  constructor(
    private readonly repository: ActivitiesRepository = activitiesRepository,
    private readonly dayRepo: DaysRepository = daysRepository,
    private readonly tripRepo: TripsRepository = tripsRepository
  ) {}

  private async validateDayAccess(dayId: string, userId: string) {
    const day = await this.dayRepo.findById(dayId);
    if (!day) {
      throw new NotFoundError("Day");
    }

    const trip = await this.tripRepo.findById(day.tripId);
    if (!trip) {
      throw new NotFoundError("Trip");
    }

    const isMember = (trip as any).members.some((m: any) => m.userId === userId);
    if (!isMember) {
      throw new AuthorizationError("You are not a member of this trip");
    }
    return day;
  }

  async getActivities(dayId: string, userId: string) {
    await this.validateDayAccess(dayId, userId);
    return this.repository.findByDayId(dayId);
  }

  async createActivity(dayId: string, userId: string, data: any) {
    await this.validateDayAccess(dayId, userId);
    
    if (data.position === undefined) {
      data.position = await this.repository.countByDayId(dayId);
    }

    return this.repository.create({
      ...data,
      dayId,
    });
  }

  async updateActivity(id: string, userId: string, data: Prisma.ActivityUpdateInput) {
    const activity = await this.repository.findById(id);
    if (!activity) {
      throw new NotFoundError("Activity");
    }
    await this.validateDayAccess(activity.dayId, userId);

    return this.repository.update(id, data);
  }

  async deleteActivity(id: string, userId: string) {
    const activity = await this.repository.findById(id);
    if (!activity) {
      throw new NotFoundError("Activity");
    }
    await this.validateDayAccess(activity.dayId, userId);

    return this.repository.delete(id);
  }

  async reorderActivities(dayId: string, userId: string, activities: { id: string; position: number }[]) {
    await this.validateDayAccess(dayId, userId);
    await this.repository.updatePositions(activities);
    return this.repository.findByDayId(dayId);
  }
}

export const activitiesService = new ActivitiesService();
