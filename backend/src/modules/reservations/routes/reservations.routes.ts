import { Router } from "express";
import { reservationsController } from "../controller/reservations.controller";
import { validate } from "@/middlewares/validate.middleware";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { createReservationSchema, updateReservationSchema } from "../validation/reservations.validation";

const router = Router();

router.get("/trip/:tripId", authMiddleware, reservationsController.getAll);
router.post("/", authMiddleware, validate(createReservationSchema), reservationsController.create);
router.patch("/:id", authMiddleware, validate(updateReservationSchema), reservationsController.update);
router.delete("/:id", authMiddleware, reservationsController.delete);

export default router;
