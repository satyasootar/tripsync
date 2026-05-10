import { Request, Response } from "express";
import { reservationsService, ReservationsService } from "../service/reservations.service";
import { ApiResponse } from "@/common/responses";
import { asyncHandler } from "@/utils/async-handler";
import { StatusCodes } from "http-status-codes";

export class ReservationsController {
  constructor(private readonly service: ReservationsService = reservationsService) {}

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { tripId } = req.params;
    const result = await this.service.getReservations(tripId, userId);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Reservations fetched successfully")
    );
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const result = await this.service.createReservation(userId, req.body);
    res.status(StatusCodes.CREATED).json(
      ApiResponse.success(result, "Reservation created successfully", StatusCodes.CREATED)
    );
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const result = await this.service.updateReservation(id, userId, req.body);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Reservation updated successfully")
    );
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { id } = req.params;
    await this.service.deleteReservation(id, userId);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(null, "Reservation deleted successfully")
    );
  });
}

export const reservationsController = new ReservationsController();
