import { Request, Response } from "express";
import { daysService, DaysService } from "../service/days.service";
import { ApiResponse } from "@/common/responses";
import { asyncHandler } from "@/utils/async-handler";
import { StatusCodes } from "http-status-codes";

export class DaysController {
  constructor(private readonly service: DaysService = daysService) {}

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { tripId } = req.params;
    const result = await this.service.getDays(tripId, userId);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Days fetched successfully")
    );
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { tripId } = req.params;
    const result = await this.service.createDay(tripId, userId, req.body);
    res.status(StatusCodes.CREATED).json(
      ApiResponse.success(result, "Day created successfully", StatusCodes.CREATED)
    );
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const result = await this.service.updateDay(id, userId, req.body);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Day updated successfully")
    );
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { id } = req.params;
    await this.service.deleteDay(id, userId);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(null, "Day deleted successfully")
    );
  });

  reorder = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { tripId } = req.params;
    const { days } = req.body;
    const result = await this.service.reorderDays(tripId, userId, days);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Days reordered successfully")
    );
  });
}

export const daysController = new DaysController();
