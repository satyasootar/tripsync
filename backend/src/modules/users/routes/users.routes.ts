import { Router } from "express";
import { usersController } from "../controller/users.controller";
import { validate } from "@/middlewares/validate.middleware";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { updateUserSchema } from "../validation/users.validation";

const router = Router();

/**
 * @openapi
 * /api/v1/users/me:
 *   get:
 *     tags: [Users]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *   patch:
 *     tags: [Users]
 *     summary: Update current user profile
 *     security:
 *       - bearerAuth: []
 */
router.get("/me", authMiddleware, usersController.getProfile);
router.patch("/me", authMiddleware, validate(updateUserSchema), usersController.updateProfile);

/**
 * @openapi
 * /api/v1/users/search:
 *   get:
 *     tags: [Users]
 *     summary: Search users by email or name
 *     security:
 *       - bearerAuth: []
 */
router.get("/search", authMiddleware, usersController.search);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user profile by ID
 *     security:
 *       - bearerAuth: []
 */
router.get("/:id", authMiddleware, usersController.getProfile);

export default router;
