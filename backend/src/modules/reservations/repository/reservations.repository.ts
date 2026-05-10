import { Reservation, Prisma } from "@prisma/client";
import prisma from "@/config/database";

export class ReservationsRepository {
  async findByTripId(tripId: string): Promise<Reservation[]> {
    return prisma.reservation.findMany({
      where: { tripId },
      orderBy: { startDate: "asc" },
    });
  }

  async findById(id: string): Promise<Reservation | null> {
    return prisma.reservation.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.ReservationCreateUncheckedInput): Promise<Reservation> {
    return prisma.reservation.create({
      data,
    });
  }

  async update(id: string, data: Prisma.ReservationUpdateInput): Promise<Reservation> {
    return prisma.reservation.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Reservation> {
    return prisma.reservation.delete({
      where: { id },
    });
  }
}

export const reservationsRepository = new ReservationsRepository();
