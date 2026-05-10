import { Request, Response } from "express";
import { activitiesService, ActivitiesService } from "../service/activities.service";
import { ApiResponse } from "@/common/responses";
import { asyncHandler } from "@/utils/async-handler";
import { StatusCodes } from "http-status-codes";

export class ActivitiesController {
  constructor(private readonly service: ActivitiesService = activitiesService) {}

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { dayId } = req.params;
    const result = await this.service.getActivities(dayId, userId);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Activities fetched successfully")
    );
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { dayId } = req.params;
    const result = await this.service.createActivity(dayId, userId, req.body);
    res.status(StatusCodes.CREATED).json(
      ApiResponse.success(result, "Activity created successfully", StatusCodes.CREATED)
    );
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const result = await this.service.updateActivity(id, userId, req.body);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Activity updated successfully")
    );
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { id } = req.params;
    await this.service.deleteActivity(id, userId);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(null, "Activity deleted successfully")
    );
  });

  reorder = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { dayId } = req.params;
    const { activities } = req.body;
    const result = await this.service.reorderActivities(dayId, userId, activities);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Activities reordered successfully")
    );
  });
}

export const activitiesController = new ActivitiesController();
