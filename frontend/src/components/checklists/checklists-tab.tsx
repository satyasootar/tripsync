import { useEffect, useState, useCallback, type FormEvent } from "react";
import api from "@/lib/axios";
import type { Checklist, ChecklistItem as ChecklistItemType, ApiResponse } from "@/lib/types";
import { toast } from "sonner";
import { ListChecks, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
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

interface ChecklistsTabProps {
  tripId: string;
}

const tabCache: Record<string, Checklist[]> = {};

export function ChecklistsTab({ tripId }: ChecklistsTabProps) {
  const [checklists, setChecklists] = useState<Checklist[]>(tabCache[tripId] || []);
  const [isLoading, setIsLoading] = useState(!tabCache[tripId]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newItemText, setNewItemText] = useState<Record<string, string>>({});

  // Create form
  const [clTitle, setClTitle] = useState("");
  const [clType, setClType] = useState("TODO");

  const loadChecklists = useCallback(async () => {
    try {
      const { data } = await api.get<ApiResponse<Checklist[]>>(`/checklists/trip/${tripId}`);
      tabCache[tripId] = data.data;
      setChecklists(data.data);
    } catch {
      toast.error("Failed to load checklists");
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    loadChecklists();
  }, [loadChecklists]);

  const handleCreateChecklist = async (e: FormEvent) => {
    e.preventDefault();
    const tempId = `temp-${Date.now()}`;
    const previousChecklists = [...checklists];
    const newTitle = clTitle;
    const newType = clType as any;

    setChecklists((prev) => [
      ...prev,
      { id: tempId, tripId, title: newTitle, type: newType, items: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ]);

    setDialogOpen(false);
    setClTitle("");
    setClType("TODO");

    try {
      await api.post("/checklists", { tripId, title: newTitle, type: newType });
      toast.success("Checklist created!");
      loadChecklists();
    } catch {
      setChecklists(previousChecklists);
      toast.error("Failed to create checklist");
    }
  };

  const handleAddItem = async (checklistId: string) => {
    const content = newItemText[checklistId]?.trim();
    if (!content) return;

    const tempId = `temp-${Date.now()}`;
    const previousChecklists = [...checklists];

    setChecklists((prev) => prev.map((c) => {
      if (c.id === checklistId) {
        return {
          ...c,
          items: [...(c.items || []), { id: tempId, checklistId, content, position: 0, isCompleted: false, assignedTo: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as any]
        };
      }
      return c;
    }));
    setNewItemText((prev) => ({ ...prev, [checklistId]: "" }));

    try {
      await api.post(`/checklists/${checklistId}/items`, { content, position: 0 });
      loadChecklists();
    } catch {
      setChecklists(previousChecklists);
      toast.error("Failed to add item");
    }
  };

  const handleToggleItem = async (item: ChecklistItemType) => {
    const previousChecklists = [...checklists];

    setChecklists((prev) => prev.map((c) => {
      if (c.id === item.checklistId) {
        return {
          ...c,
          items: (c.items || []).map((i) => i.id === item.id ? { ...i, isCompleted: !item.isCompleted } : i)
        };
      }
      return c;
    }));

    try {
      await api.patch(`/checklists/items/${item.id}`, {
        isCompleted: !item.isCompleted,
      });
    } catch {
      setChecklists(previousChecklists);
      toast.error("Failed to update item");
    }
  };

  const handleDeleteItem = async (checklistId: string, itemId: string) => {
    const previousChecklists = [...checklists];

    setChecklists((prev) => prev.map((c) => {
      if (c.id === checklistId) {
        return {
          ...c,
          items: (c.items || []).filter((i) => i.id !== itemId)
        };
      }
      return c;
    }));

    try {
      await api.delete(`/checklists/items/${itemId}`);
    } catch {
      setChecklists(previousChecklists);
      toast.error("Failed to delete item");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-4 w-8" />
                </div>
                <CardDescription>
                  <Skeleton className="mt-1 h-1.5 w-full rounded-full" />
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Skeleton className="size-4 rounded-sm" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
                <Separator className="my-1" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Checklists</h3>
        <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="mr-1 size-3.5" />New Checklist</Button>
      </div>

      {checklists.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <ListChecks className="size-7 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No checklists yet — create one to stay organized</p>
        </div>
      ) : (
        checklists.map((checklist) => {
          const items = checklist.items || [];
          const completed = items.filter((i) => i.isCompleted).length;
          const progress = items.length > 0 ? Math.round((completed / items.length) * 100) : 0;

          return (
            <Card key={checklist.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{checklist.title}</CardTitle>
                    <Badge variant="secondary" className="text-[10px]">
                      {checklist.type.toLowerCase()}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {completed}/{items.length}
                  </span>
                </div>
                <CardDescription>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-md px-1 py-1.5 transition-colors hover:bg-accent/50"
                  >
                    <Checkbox
                      checked={item.isCompleted}
                      onCheckedChange={() => handleToggleItem(item)}
                    />
                    <span
                      className={`flex-1 text-sm ${item.isCompleted ? "text-muted-foreground line-through" : ""}`}
                    >
                      {item.content}
                    </span>
                    {item.assignee && (
                      <span className="text-xs text-muted-foreground">
                        {item.assignee.firstName}
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-6 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteItem(checklist.id, item.id)}
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                ))}

                <Separator className="my-2" />

                {/* Add item inline */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add an item…"
                    className="h-8 text-sm"
                    value={newItemText[checklist.id] || ""}
                    onChange={(e) =>
                      setNewItemText((prev) => ({ ...prev, [checklist.id]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddItem(checklist.id);
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8"
                    onClick={() => handleAddItem(checklist.id)}
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}

      {/* Create Checklist Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>New Checklist</DialogTitle>
            <DialogDescription>Create a new checklist for this trip.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateChecklist} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Title</Label>
              <Input
                value={clTitle}
                onChange={(e) => setClTitle(e.target.value)}
                placeholder="Packing List"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Type</Label>
              <Select value={clType} onValueChange={setClType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">To-Do</SelectItem>
                  <SelectItem value="PACKING">Packing</SelectItem>
                  <SelectItem value="CUSTOM">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!clTitle.trim()}>Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
