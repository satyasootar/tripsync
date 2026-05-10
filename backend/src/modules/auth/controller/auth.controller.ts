import { Request, Response } from "express";
import { authService, AuthService } from "../service/auth.service";
import { ApiResponse } from "@/common/responses";
import { asyncHandler } from "@/utils/async-handler";
import { StatusCodes } from "http-status-codes";

export class AuthController {
  constructor(private readonly service: AuthService = authService) {}

  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.register(req.body);
    res.status(StatusCodes.CREATED).json(
      ApiResponse.success(result, "User registered successfully", StatusCodes.CREATED)
    );
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.login(req.body);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Logged in successfully")
    );
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.refresh(req.body.refreshToken);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Token refreshed successfully")
    );
  });

  me = asyncHandler(async (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json(
      ApiResponse.success((req as any).user, "User profile fetched successfully")
    );
  });
}

export const authController = new AuthController();
