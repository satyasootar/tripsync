import { Expense, Prisma } from "@prisma/client";
import { expensesRepository, ExpensesRepository } from "../repository/expenses.repository";
import { tripsRepository, TripsRepository } from "@/modules/trips/repository/trips.repository";
import { NotFoundError, AuthorizationError, BadRequestError } from "@/common/errors";
import { Decimal } from "@prisma/client/runtime/library";

export class ExpensesService {
  constructor(
    private readonly repository: ExpensesRepository = expensesRepository,
    private readonly tripRepo: TripsRepository = tripsRepository
  ) {}

  private async validateTripAccess(tripId: string, userId: string) {
    const trip = await this.tripRepo.findById(tripId);
    if (!trip) throw new NotFoundError("Trip");

    const isMember = (trip as any).members.some((m: any) => m.userId === userId);
    if (!isMember) throw new AuthorizationError("You are not a member of this trip");
  }

  async getExpenses(tripId: string, userId: string) {
    await this.validateTripAccess(tripId, userId);
    return this.repository.findByTripId(tripId);
  }

  async createExpense(userId: string, data: any) {
    await this.validateTripAccess(data.tripId, userId);

    const { participants, amount, ...expenseData } = data;
    
    // Validate total participant amount matches total expense amount
    const totalParticipantAmount = participants.reduce((sum: number, p: any) => sum + p.amount, 0);
    if (Math.abs(totalParticipantAmount - amount) > 0.01) {
      throw new BadRequestError("Total participant amounts must match the total expense amount");
    }

    return this.repository.create(
      { ...expenseData, amount: new Decimal(amount) },
      participants.map((p: any) => ({ ...p, amount: new Decimal(p.amount) }))
    );
  }

  async updateExpense(id: string, userId: string, data: any) {
    const expense = await this.repository.findById(id);
    if (!expense) throw new NotFoundError("Expense");
    await this.validateTripAccess(expense.tripId, userId);

    const { participants, amount, ...expenseData } = data;

    if (amount !== undefined && participants) {
        const totalParticipantAmount = participants.reduce((sum: number, p: any) => sum + p.amount, 0);
        if (Math.abs(totalParticipantAmount - amount) > 0.01) {
          throw new BadRequestError("Total participant amounts must match the total expense amount");
        }
    }

    return this.repository.update(
      id,
      { ...expenseData, amount: amount !== undefined ? new Decimal(amount) : undefined },
      participants?.map((p: any) => ({ ...p, amount: new Decimal(p.amount) }))
    );
  }

  async deleteExpense(id: string, userId: string) {
    const expense = await this.repository.findById(id);
    if (!expense) throw new NotFoundError("Expense");
    await this.validateTripAccess(expense.tripId, userId);

    return this.repository.delete(id);
  }

  async getTripSummary(tripId: string, userId: string) {
    await this.validateTripAccess(tripId, userId);
    const expenses = await this.repository.getSummary(tripId);
    
    const balances: Record<string, number> = {};
    
    expenses.forEach(exp => {
      const paidById = exp.paidById;
      balances[paidById] = (balances[paidById] || 0) + Number(exp.amount);
      
      exp.participants.forEach(p => {
        balances[p.userId] = (balances[p.userId] || 0) - Number(p.amount);
      });
    });

    return {
      totalSpent: expenses.reduce((sum, exp) => sum + Number(exp.amount), 0),
      balances,
    };
  }
}

export const expensesService = new ExpensesService();
