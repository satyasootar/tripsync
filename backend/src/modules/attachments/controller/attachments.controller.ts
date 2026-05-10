import { Request, Response } from "express";
import { attachmentsService, AttachmentsService } from "../service/attachments.service";
import { ApiResponse } from "@/common/responses";
import { asyncHandler } from "@/utils/async-handler";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "@/common/errors";

export class AttachmentsController {
  constructor(private readonly service: AttachmentsService = attachmentsService) {}

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { tripId } = req.params;
    const result = await this.service.getAttachments(tripId, userId);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Attachments fetched successfully")
    );
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { tripId } = req.body;
    const file = req.file;

    if (!file) {
      throw new BadRequestError("No file uploaded");
    }

    const result = await this.service.createAttachment(userId, tripId, file);
    res.status(StatusCodes.CREATED).json(
      ApiResponse.success(result, "Attachment uploaded successfully", StatusCodes.CREATED)
    );
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { id } = req.params;
    await this.service.deleteAttachment(id, userId);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(null, "Attachment deleted successfully")
    );
  });
}

export const attachmentsController = new AttachmentsController();
