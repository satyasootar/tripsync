import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "@/common/errors";
import { ApiResponse } from "@/common/responses";
import { logger } from "@/utils/logger";

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message } = err;

  if (!(err instanceof AppError)) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = err.message || "Something went wrong";
  }

  // Log error
  logger.error({
    err,
    method: req.method,
    url: req.url,
    body: req.body,
    user: (req as any).user?.id,
  });

  const response = ApiResponse.error(
    message,
    err.errors || [],
    statusCode
  );

  res.status(statusCode).json(response);
};
