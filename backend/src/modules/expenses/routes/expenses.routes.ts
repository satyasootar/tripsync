import { Router } from "express";
import { expensesController } from "../controller/expenses.controller";
import { validate } from "@/middlewares/validate.middleware";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { createExpenseSchema, updateExpenseSchema } from "../validation/expenses.validation";

const router = Router();

router.get("/trip/:tripId", authMiddleware, expensesController.getAll);
router.get("/trip/:tripId/summary", authMiddleware, expensesController.getSummary);
router.post("/", authMiddleware, validate(createExpenseSchema), expensesController.create);
router.patch("/:id", authMiddleware, validate(updateExpenseSchema), expensesController.update);
router.delete("/:id", authMiddleware, expensesController.delete);

export default router;
