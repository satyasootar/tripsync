import { Router } from "express";
import { daysController } from "../controller/days.controller";
import { validate } from "@/middlewares/validate.middleware";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { createDaySchema, updateDaySchema, reorderDaysSchema } from "../validation/days.validation";

const router = Router();

/**
 * @openapi
 * /api/v1/days/trip/{tripId}:
 *   get:
 *     tags: [Days]
 *     summary: Get all days for a trip
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *   post:
 *     tags: [Days]
 *     summary: Create a new day for a trip
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 */
router.get("/trip/:tripId", authMiddleware, daysController.getAll);
router.post("/trip/:tripId", authMiddleware, validate(createDaySchema), daysController.create);

/**
 * @openapi
 * /api/v1/days/{id}:
 *   patch:
 *     tags: [Days]
 *     summary: Update a day
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     tags: [Days]
 *     summary: Delete a day
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 */
router.patch("/:id", authMiddleware, validate(updateDaySchema), daysController.update);
router.delete("/:id", authMiddleware, daysController.delete);

/**
 * @openapi
 * /api/v1/days/trip/{tripId}/reorder:
 *   patch:
 *     tags: [Days]
 *     summary: Reorder days for a trip
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 */
router.patch("/trip/:tripId/reorder", authMiddleware, validate(reorderDaysSchema), daysController.reorder);

export default router;
