import { Router } from "express";
import { membersController } from "../controller/members.controller";
import { validate } from "@/middlewares/validate.middleware";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { addMemberSchema, updateMemberRoleSchema } from "../validation/members.validation";

const router = Router();

/**
 * @openapi
 * /api/v1/members:
 *   post:
 *     tags: [Members]
 *     summary: Add a member to a trip
 *     security:
 *       - bearerAuth: []
 */
router.post("/", authMiddleware, validate(addMemberSchema), membersController.add);

/**
 * @openapi
 * /api/v1/members/trip/{tripId}:
 *   get:
 *     tags: [Members]
 *     summary: Get all members of a trip
 *     security:
 *       - bearerAuth: []
 */
router.get("/trip/:tripId", authMiddleware, membersController.getTripMembers);

/**
 * @openapi
 * /api/v1/members/{memberId}:
 *   patch:
 *     tags: [Members]
 *     summary: Update member role
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     tags: [Members]
 *     summary: Remove member from trip
 *     security:
 *       - bearerAuth: []
 */
router.patch("/:memberId", authMiddleware, validate(updateMemberRoleSchema), membersController.updateRole);
router.delete("/:memberId", authMiddleware, membersController.remove);

export default router;
