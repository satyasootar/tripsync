import { Router } from "express";
import { invitesController } from "../controller/invites.controller";
import { validate } from "@/middlewares/validate.middleware";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { createInviteSchema, respondInviteSchema } from "../validation/invites.validation";

const router = Router();

router.post("/", authMiddleware, validate(createInviteSchema), invitesController.send);
router.post("/:id/respond", authMiddleware, validate(respondInviteSchema), invitesController.respond);
router.get("/my", authMiddleware, invitesController.getMyPendingInvites);
router.get("/trip/:tripId", authMiddleware, invitesController.getTripInvites);

export default router;
