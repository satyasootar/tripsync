import { Router } from "express";
import { activitiesController } from "../controller/activities.controller";
import { validate } from "@/middlewares/validate.middleware";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { createActivitySchema, updateActivitySchema, reorderActivitiesSchema } from "../validation/activities.validation";

const router = Router();

/**
 * @openapi
 * /api/v1/activities/day/{dayId}:
 *   get:
 *     tags: [Activities]
 *     summary: Get all activities for a day
 *     parameters:
 *       - in: path
 *         name: dayId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *   post:
 *     tags: [Activities]
 *     summary: Create a new activity for a day
 *     parameters:
 *       - in: path
 *         name: dayId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 */
router.get("/day/:dayId", authMiddleware, activitiesController.getAll);
router.post("/day/:dayId", authMiddleware, validate(createActivitySchema), activitiesController.create);

/**
 * @openapi
 * /api/v1/activities/{id}:
 *   patch:
 *     tags: [Activities]
 *     summary: Update an activity
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     tags: [Activities]
 *     summary: Delete an activity
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 */
router.patch("/:id", authMiddleware, validate(updateActivitySchema), activitiesController.update);
router.delete("/:id", authMiddleware, activitiesController.delete);

/**
 * @openapi
 * /api/v1/activities/day/{dayId}/reorder:
 *   patch:
 *     tags: [Activities]
 *     summary: Reorder activities for a day
 *     parameters:
 *       - in: path
 *         name: dayId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 */
router.patch("/day/:dayId/reorder", authMiddleware, validate(reorderActivitiesSchema), activitiesController.reorder);

export default router;
