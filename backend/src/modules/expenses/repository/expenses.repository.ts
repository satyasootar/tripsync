import { Expense, ExpenseParticipant, Prisma } from "@prisma/client";
import prisma from "@/config/database";

export class ExpensesRepository {
  async findByTripId(tripId: string): Promise<Expense[]> {
    return prisma.expense.findMany({
      where: { tripId },
      include: {
        paidBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: { date: "desc" },
    });
  }

  async findById(id: string): Promise<Expense | null> {
    return prisma.expense.findUnique({
      where: { id },
      include: {
        participants: true,
      },
    });
  }

  async create(data: Prisma.ExpenseCreateUncheckedInput, participants: Prisma.ExpenseParticipantCreateManyExpenseInput[]): Promise<Expense> {
    return prisma.expense.create({
      data: {
        ...data,
        participants: {
          createMany: {
            data: participants,
          },
        },
      },
      include: {
        participants: true,
      },
    });
  }

  async update(id: string, data: Prisma.ExpenseUpdateInput, participants?: Prisma.ExpenseParticipantCreateManyExpenseInput[]): Promise<Expense> {
    return prisma.$transaction(async (tx) => {
      if (participants) {
        await tx.expenseParticipant.deleteMany({
          where: { expenseId: id },
        });
        await tx.expenseParticipant.createMany({
          data: participants.map(p => ({ ...p, expenseId: id })),
        });
      }

      return tx.expense.update({
        where: { id },
        data,
        include: {
          participants: true,
        },
      });
    });
  }

  async delete(id: string): Promise<Expense> {
    return prisma.expense.delete({
      where: { id },
    });
  }

  async getSummary(tripId: string) {
    const expenses = await prisma.expense.findMany({
      where: { tripId },
      include: {
        participants: true,
      },
    });

    // Basic summary calculation logic could be here or in service
    return expenses;
  }
}

export const expensesRepository = new ExpensesRepository();
