import { Request, Response } from "express";
import { membersService, MembersService } from "../service/members.service";
import { ApiResponse } from "@/common/responses";
import { asyncHandler } from "@/utils/async-handler";
import { StatusCodes } from "http-status-codes";

export class MembersController {
  constructor(private readonly service: MembersService = membersService) {}

  add = asyncHandler(async (req: Request, res: Response) => {
    const requesterId = (req as any).user.id;
    const result = await this.service.addMember(req.body, requesterId);
    res.status(StatusCodes.CREATED).json(
      ApiResponse.success(result, "Member added successfully", StatusCodes.CREATED)
    );
  });

  getTripMembers = asyncHandler(async (req: Request, res: Response) => {
    const tripId = req.params.tripId;
    const result = await this.service.getTripMembers(tripId);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Trip members fetched successfully")
    );
  });

  updateRole = asyncHandler(async (req: Request, res: Response) => {
    const requesterId = (req as any).user.id;
    const { memberId } = req.params;
    const { role } = req.body;
    const result = await this.service.updateMemberRole(memberId, role, requesterId);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Member role updated successfully")
    );
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    const requesterId = (req as any).user.id;
    const { memberId } = req.params;
    await this.service.removeMember(memberId, requesterId);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(null, "Member removed successfully")
    );
  });
}

export const membersController = new MembersController();
