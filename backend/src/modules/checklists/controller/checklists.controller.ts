import { Request, Response } from "express";
import { checklistsService, ChecklistsService } from "../service/checklists.service";
import { ApiResponse } from "@/common/responses";
import { asyncHandler } from "@/utils/async-handler";
import { StatusCodes } from "http-status-codes";

export class ChecklistsController {
  constructor(private readonly service: ChecklistsService = checklistsService) {}

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { tripId } = req.params;
    const result = await this.service.getChecklists(tripId, userId);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Checklists fetched successfully")
    );
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const result = await this.service.createChecklist(userId, req.body);
    res.status(StatusCodes.CREATED).json(
      ApiResponse.success(result, "Checklist created successfully", StatusCodes.CREATED)
    );
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const result = await this.service.updateChecklist(id, userId, req.body);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Checklist updated successfully")
    );
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { id } = req.params;
    await this.service.deleteChecklist(id, userId);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(null, "Checklist deleted successfully")
    );
  });

  // Items
  addItem = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { checklistId } = req.params;
    const result = await this.service.createItem(checklistId, userId, req.body);
    res.status(StatusCodes.CREATED).json(
      ApiResponse.success(result, "Item added successfully", StatusCodes.CREATED)
    );
  });

  updateItem = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const result = await this.service.updateItem(id, userId, req.body);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Item updated successfully")
    );
  });

  deleteItem = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { id } = req.params;
    await this.service.deleteItem(id, userId);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(null, "Item deleted successfully")
    );
  });

  reorderItems = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { checklistId } = req.params;
    const { items } = req.body;
    const result = await this.service.reorderItems(checklistId, userId, items);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Items reordered successfully")
    );
  });
}

export const checklistsController = new ChecklistsController();
