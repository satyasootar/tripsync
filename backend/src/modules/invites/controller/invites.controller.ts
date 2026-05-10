import { Request, Response } from "express";
import { invitesService, InvitesService } from "../service/invites.service";
import { ApiResponse } from "@/common/responses";
import { asyncHandler } from "@/utils/async-handler";
import { StatusCodes } from "http-status-codes";

export class InvitesController {
  constructor(private readonly service: InvitesService = invitesService) {}

  send = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const result = await this.service.sendInvite(userId, req.body);
    res.status(StatusCodes.CREATED).json(
      ApiResponse.success(result, "Invite sent successfully", StatusCodes.CREATED)
    );
  });

  respond = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const userEmail = (req as any).user.email;
    const { id } = req.params;
    const { accept } = req.body;
    const result = await this.service.respondToInvite(id, userId, userEmail, accept);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, `Invite ${accept ? "accepted" : "declined"} successfully`)
    );
  });

  getTripInvites = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { tripId } = req.params;
    const result = await this.service.getTripInvites(tripId, userId);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Trip invites fetched successfully")
    );
  });

  getMyPendingInvites = asyncHandler(async (req: Request, res: Response) => {
    const userEmail = (req as any).user.email;
    const result = await this.service.getMyPendingInvites(userEmail);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Pending invites fetched successfully")
    );
  });
}

export const invitesController = new InvitesController();
