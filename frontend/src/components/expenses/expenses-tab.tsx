import { useEffect, useState, useCallback, type FormEvent } from "react";
import { format } from "date-fns";
import api from "@/lib/axios";
import type { Expense, TripMember, ApiResponse } from "@/lib/types";
import { toast } from "sonner";
import { Wallet, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExpensesTabProps {
  tripId: string;
}

const tabCache: Record<string, { expenses: Expense[]; members: TripMember[] }> = {};

export function ExpensesTab({ tripId }: ExpensesTabProps) {
  const [expenses, setExpenses] = useState<Expense[]>(tabCache[tripId]?.expenses || []);
  const [members, setMembers] = useState<TripMember[]>(tabCache[tripId]?.members || []);
  const [isLoading, setIsLoading] = useState(!tabCache[tripId]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [paidById, setPaidById] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [expRes, memRes] = await Promise.all([
        api.get<ApiResponse<Expense[]>>(`/expenses/trip/${tripId}`),
        api.get<ApiResponse<TripMember[]>>(`/members/trip/${tripId}`),
      ]);
      const expData = expRes.data.data;
      const memData = memRes.data.data;
      tabCache[tripId] = { expenses: expData, members: memData };
      setExpenses(expData);
      setMembers(memData);
    } catch {
      toast.error("Failed to load expenses");
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalByCurrency = expenses.reduce((acc, e) => {
    acc[e.currency] = (acc[e.currency] || 0) + Number(e.amount);
    return acc;
  }, {} as Record<string, number>);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const numAmount = parseFloat(amount);
    const perPerson = numAmount / members.length;
    const tempId = `temp-${Date.now()}`;
    const previousExpenses = [...expenses];
    
    const payload = {
      tripId,
      description,
      amount: numAmount,
      currency,
      paidById,
      splitType: "EQUAL",
      participants: members.map((m) => ({
        userId: m.userId,
        amount: parseFloat(perPerson.toFixed(2)),
      })),
    };
    
    setExpenses((prev) => [
      { id: tempId, tripId, description, amount: numAmount, currency, paidById, date: new Date().toISOString(), splitType: "EQUAL", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as any,
      ...prev
    ]);
    
    setDialogOpen(false);
    setDescription("");
    setAmount("");
    setPaidById("");

    try {
      await api.post("/expenses", payload);
      toast.success("Expense added!");
      loadData();
    } catch {
      setExpenses(previousExpenses);
      toast.error("Failed to add expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {/* Summary Card Skeleton */}
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="mt-3 h-4 w-40" />
          </CardContent>
        </Card>
        
        {/* Expense List Header Skeleton */}
        <div className="flex items-center justify-between mt-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>

        {/* Expense Items Skeleton */}
        <div className="flex flex-col gap-2 mt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              {i > 0 && <Separator />}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-full" />
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Summary Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Expense Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {Object.entries(totalByCurrency).length === 0 ? (
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">$0.00</span>
                <span className="text-sm text-muted-foreground">total spent</span>
              </div>
            ) : (
              Object.entries(totalByCurrency).map(([curr, amount]) => (
                <div key={curr} className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    {curr === "USD" ? "$" : curr} {amount.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground">total spent in {curr}</span>
                </div>
              ))
            )}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Split among {members.length} member{members.length !== 1 && "s"}
          </p>
        </CardContent>
      </Card>

      {/* Expense List */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium">All Expenses</h3>
        <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="mr-1 size-3.5" />Add Expense</Button>
      </div>

      {expenses.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <Wallet className="size-7 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No expenses recorded yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {expenses.map((expense, idx) => {
            const payer = members.find((m) => m.userId === expense.paidById);
            const payerName = payer?.user
              ? `${payer.user.firstName} ${payer.user.lastName}`
              : "Unknown";
            const payerInitials = payer?.user
              ? `${payer.user.firstName[0]}${payer.user.lastName[0]}`
              : "?";
            return (
              <div key={expense.id}>
                {idx > 0 && <Separator />}
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">{payerInitials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{expense.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Paid by {payerName} • {format(new Date(expense.date), "MMM d")}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold">
                    {expense.currency === "USD" ? "$" : expense.currency}{" "}
                    {Number(expense.amount).toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Expense Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogDescription>Record a shared expense for this trip.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Dinner at the restaurant"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="50.00"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Paid by</Label>
              <Select value={paidById} onValueChange={setPaidById} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select who paid" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((m) => (
                    <SelectItem key={m.userId} value={m.userId}>
                      {m.user ? `${m.user.firstName} ${m.user.lastName}` : m.userId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              Will be split equally among all {members.length} members
            </p>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !paidById}>
                {isSubmitting ? "Adding…" : "Add Expense"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
