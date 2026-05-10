import { Request, Response } from "express";
import { commentsService, CommentsService } from "../service/comments.service";
import { ApiResponse } from "@/common/responses";
import { asyncHandler } from "@/utils/async-handler";
import { StatusCodes } from "http-status-codes";

export class CommentsController {
  constructor(private readonly service: CommentsService = commentsService) {}

  getByDay = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { dayId } = req.params;
    const result = await this.service.getCommentsByDay(dayId, userId);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Comments fetched successfully")
    );
  });

  getByActivity = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { activityId } = req.params;
    const result = await this.service.getCommentsByActivity(activityId, userId);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Comments fetched successfully")
    );
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const result = await this.service.createComment(userId, req.body);
    res.status(StatusCodes.CREATED).json(
      ApiResponse.success(result, "Comment created successfully", StatusCodes.CREATED)
    );
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { content } = req.body;
    const result = await this.service.updateComment(id, userId, content);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Comment updated successfully")
    );
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { id } = req.params;
    await this.service.deleteComment(id, userId);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(null, "Comment deleted successfully")
    );
  });
}

export const commentsController = new CommentsController();
