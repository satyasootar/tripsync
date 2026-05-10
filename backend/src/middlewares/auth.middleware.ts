import { Request, Response, NextFunction } from "express";
import { AuthenticationError, AuthorizationError } from "@/common/errors";
import { verifyAccessToken } from "@/utils/jwt";
import prisma from "@/config/database";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthenticationError("No token provided");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new AuthenticationError("Invalid token format");
    }

    const payload = verifyAccessToken(token);
    
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });


    if (!user) {
      throw new AuthenticationError("User not found");
    }

    (req as any).user = user;
    next();
  } catch (error) {
    next(error);
  }
};
