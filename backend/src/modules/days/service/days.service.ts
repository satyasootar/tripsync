import { Day, Prisma } from "@prisma/client";
import { daysRepository, DaysRepository } from "../repository/days.repository";
import { tripsRepository, TripsRepository } from "@/modules/trips/repository/trips.repository";
import { NotFoundError, AuthorizationError } from "@/common/errors";

export class DaysService {
  constructor(
    private readonly repository: DaysRepository = daysRepository,
    private readonly tripRepo: TripsRepository = tripsRepository
  ) {}

  private async validateTripAccess(tripId: string, userId: string) {
    const trip = await this.tripRepo.findById(tripId);
    if (!trip) {
      throw new NotFoundError("Trip");
    }

    const isMember = (trip as any).members.some((m: any) => m.userId === userId);
    if (!isMember) {
      throw new AuthorizationError("You are not a member of this trip");
    }
    return trip;
  }

  async getDays(tripId: string, userId: string) {
    await this.validateTripAccess(tripId, userId);
    return this.repository.findByTripId(tripId);
  }

  async createDay(tripId: string, userId: string, data: any) {
    await this.validateTripAccess(tripId, userId);
    
    // Auto-calculate position if not provided
    if (data.position === undefined) {
      data.position = await this.repository.countByTripId(tripId);
    }

    return this.repository.create({
      ...data,
      tripId,
    });
  }

  async updateDay(id: string, userId: string, data: Prisma.DayUpdateInput) {
    const day = await this.repository.findById(id);
    if (!day) {
      throw new NotFoundError("Day");
    }
    await this.validateTripAccess(day.tripId, userId);

    return this.repository.update(id, data);
  }

  async deleteDay(id: string, userId: string) {
    const day = await this.repository.findById(id);
    if (!day) {
      throw new NotFoundError("Day");
    }
    await this.validateTripAccess(day.tripId, userId);

    return this.repository.delete(id);
  }

  async reorderDays(tripId: string, userId: string, days: { id: string; position: number }[]) {
    await this.validateTripAccess(tripId, userId);
    await this.repository.updatePositions(days);
    return this.repository.findByTripId(tripId);
  }
}

export const daysService = new DaysService();
