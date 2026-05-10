import { Router } from "express";
import { attachmentsController } from "../controller/attachments.controller";
import { validate } from "@/middlewares/validate.middleware";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { upload } from "@/middlewares/upload.middleware";
import { createAttachmentSchema } from "../validation/attachments.validation";

const router = Router();

router.get("/trip/:tripId", authMiddleware, attachmentsController.getAll);
router.post("/", authMiddleware, upload.single("file"), validate(createAttachmentSchema), attachmentsController.create);
router.delete("/:id", authMiddleware, attachmentsController.delete);

export default router;
