import { Request, Response } from "express";
import { tripsService, TripsService } from "../service/trips.service";
import { ApiResponse } from "@/common/responses";
import { asyncHandler } from "@/utils/async-handler";
import { StatusCodes } from "http-status-codes";

export class TripsController {
  constructor(private readonly service: TripsService = tripsService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const result = await this.service.createTrip(req.body, userId);
    res.status(StatusCodes.CREATED).json(
      ApiResponse.success(result, "Trip created successfully", StatusCodes.CREATED)
    );
  });

  getOne = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.getTrip(req.params.id);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Trip fetched successfully")
    );
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const result = await this.service.getUserTrips(userId);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Trips fetched successfully")
    );
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.updateTrip(req.params.id, req.body);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Trip updated successfully")
    );
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteTrip(req.params.id);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(null, "Trip deleted successfully")
    );
  });
}

export const tripsController = new TripsController();
