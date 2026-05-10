import { Request, Response } from "express";
import { usersService, UsersService } from "../service/users.service";
import { ApiResponse } from "@/common/responses";
import { asyncHandler } from "@/utils/async-handler";
import { StatusCodes } from "http-status-codes";

export class UsersController {
  constructor(private readonly service: UsersService = usersService) {}

  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.id || (req as any).user.id;
    const result = await this.service.getProfile(userId);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "User profile fetched successfully")
    );
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const result = await this.service.updateProfile(userId, req.body);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Profile updated successfully")
    );
  });

  search = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query.q as string;
    if (!query) {
      return res.status(StatusCodes.OK).json(ApiResponse.success([], "Search query required"));
    }
    const result = await this.service.searchUsers(query);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Users searched successfully")
    );
  });
}

export const usersController = new UsersController();
