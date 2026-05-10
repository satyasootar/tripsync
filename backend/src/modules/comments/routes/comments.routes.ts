import { Router } from "express";
import { commentsController } from "../controller/comments.controller";
import { validate } from "@/middlewares/validate.middleware";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { createCommentSchema, updateCommentSchema } from "../validation/comments.validation";

const router = Router();

router.get("/day/:dayId", authMiddleware, commentsController.getByDay);
router.get("/activity/:activityId", authMiddleware, commentsController.getByActivity);
router.post("/", authMiddleware, validate(createCommentSchema), commentsController.create);
router.patch("/:id", authMiddleware, validate(updateCommentSchema), commentsController.update);
router.delete("/:id", authMiddleware, commentsController.delete);

export default router;
