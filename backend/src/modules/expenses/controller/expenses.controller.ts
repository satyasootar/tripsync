import { Request, Response } from "express";
import { expensesService, ExpensesService } from "../service/expenses.service";
import { ApiResponse } from "@/common/responses";
import { asyncHandler } from "@/utils/async-handler";
import { StatusCodes } from "http-status-codes";

export class ExpensesController {
  constructor(private readonly service: ExpensesService = expensesService) {}

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { tripId } = req.params;
    const result = await this.service.getExpenses(tripId, userId);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Expenses fetched successfully")
    );
  });

  getSummary = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { tripId } = req.params;
    const result = await this.service.getTripSummary(tripId, userId);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Expense summary fetched successfully")
    );
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const result = await this.service.createExpense(userId, req.body);
    res.status(StatusCodes.CREATED).json(
      ApiResponse.success(result, "Expense created successfully", StatusCodes.CREATED)
    );
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const result = await this.service.updateExpense(id, userId, req.body);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(result, "Expense updated successfully")
    );
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { id } = req.params;
    await this.service.deleteExpense(id, userId);
    res.status(StatusCodes.OK).json(
      ApiResponse.success(null, "Expense deleted successfully")
    );
  });
}

export const expensesController = new ExpensesController();
