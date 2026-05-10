import { Router } from "express";
import { tripsController } from "../controller/trips.controller";
import { validate } from "@/middlewares/validate.middleware";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { createTripSchema, updateTripSchema } from "../validation/trips.validation";

const router = Router();

/**
 * @openapi
 * /api/v1/trips:
 *   post:
 *     tags: [Trips]
 *     summary: Create a new trip
 *     security:
 *       - bearerAuth: []
 *   get:
 *     tags: [Trips]
 *     summary: Get all user trips
 *     security:
 *       - bearerAuth: []
 */
router.post("/", authMiddleware, validate(createTripSchema), tripsController.create);
router.get("/", authMiddleware, tripsController.getAll);

/**
 * @openapi
 * /api/v1/trips/{id}:
 *   get:
 *     tags: [Trips]
 *     summary: Get trip by ID
 *     security:
 *       - bearerAuth: []
 *   patch:
 *     tags: [Trips]
 *     summary: Update trip
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     tags: [Trips]
 *     summary: Delete trip
 *     security:
 *       - bearerAuth: []
 */
router.get("/:id", authMiddleware, tripsController.getOne);
router.patch("/:id", authMiddleware, validate(updateTripSchema), tripsController.update);
router.delete("/:id", authMiddleware, tripsController.delete);

export default router;
