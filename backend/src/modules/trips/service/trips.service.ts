import { Prisma } from "@prisma/client";
import { tripsRepository, TripsRepository } from "../repository/trips.repository";
import { NotFoundError } from "@/common/errors";

export class TripsService {
  constructor(private readonly repository: TripsRepository = tripsRepository) {}

  async createTrip(data: any, userId: string) {
    return this.repository.create(data, userId);
  }

  async getTrip(id: string) {
    const trip = await this.repository.findById(id);
    if (!trip) {
      throw new NotFoundError("Trip");
    }
    return trip;
  }

  async getUserTrips(userId: string) {
    return this.repository.findAllByUser(userId);
  }

  async updateTrip(id: string, data: Prisma.TripUpdateInput) {
    await this.getTrip(id); // Ensure exists
    return this.repository.update(id, data);
  }

  async deleteTrip(id: string) {
    await this.getTrip(id); // Ensure exists
    return this.repository.delete(id);
  }
}

export const tripsService = new TripsService();
