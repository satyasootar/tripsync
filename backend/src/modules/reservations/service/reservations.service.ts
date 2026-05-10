import { Reservation, Prisma } from "@prisma/client";
import { reservationsRepository, ReservationsRepository } from "../repository/reservations.repository";
import { tripsRepository, TripsRepository } from "@/modules/trips/repository/trips.repository";
import { NotFoundError, AuthorizationError } from "@/common/errors";

export class ReservationsService {
  constructor(
    private readonly repository: ReservationsRepository = reservationsRepository,
    private readonly tripRepo: TripsRepository = tripsRepository
  ) {}

  private async validateTripAccess(tripId: string, userId: string) {
    const trip = await this.tripRepo.findById(tripId);
    if (!trip) throw new NotFoundError("Trip");

    const isMember = (trip as any).members.some((m: any) => m.userId === userId);
    if (!isMember) throw new AuthorizationError("You are not a member of this trip");
  }

  async getReservations(tripId: string, userId: string) {
    await this.validateTripAccess(tripId, userId);
    return this.repository.findByTripId(tripId);
  }

  async createReservation(userId: string, data: any) {
    await this.validateTripAccess(data.tripId, userId);
    return this.repository.create(data);
  }

  async updateReservation(id: string, userId: string, data: Prisma.ReservationUpdateInput) {
    const reservation = await this.repository.findById(id);
    if (!reservation) throw new NotFoundError("Reservation");
    await this.validateTripAccess(reservation.tripId, userId);

    return this.repository.update(id, data);
  }

  async deleteReservation(id: string, userId: string) {
    const reservation = await this.repository.findById(id);
    if (!reservation) throw new NotFoundError("Reservation");
    await this.validateTripAccess(reservation.tripId, userId);

    return this.repository.delete(id);
  }
}

export const reservationsService = new ReservationsService();
