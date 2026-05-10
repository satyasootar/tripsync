import { Router } from "express";
import { checklistsController } from "../controller/checklists.controller";
import { validate } from "@/middlewares/validate.middleware";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { 
  createChecklistSchema, 
  updateChecklistSchema, 
  createChecklistItemSchema, 
  updateChecklistItemSchema,
  reorderChecklistItemsSchema
} from "../validation/checklists.validation";

const router = Router();

router.get("/trip/:tripId", authMiddleware, checklistsController.getAll);
router.post("/", authMiddleware, validate(createChecklistSchema), checklistsController.create);
router.patch("/:id", authMiddleware, validate(updateChecklistSchema), checklistsController.update);
router.delete("/:id", authMiddleware, checklistsController.delete);

// Items
router.post("/:checklistId/items", authMiddleware, validate(createChecklistItemSchema), checklistsController.addItem);
router.patch("/items/:id", authMiddleware, validate(updateChecklistItemSchema), checklistsController.updateItem);
router.delete("/items/:id", authMiddleware, checklistsController.deleteItem);
router.patch("/:checklistId/items/reorder", authMiddleware, validate(reorderChecklistItemsSchema), checklistsController.reorderItems);

export default router;
