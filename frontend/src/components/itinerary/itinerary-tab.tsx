import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import api from "@/lib/axios";
import type { Day, Activity, ApiResponse } from "@/lib/types";
import { toast } from "sonner";
import { CalendarDays, Clock, MapPin, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusColors: Record<string, string> = {
  PLANNED: "secondary",
  CONFIRMED: "default",
  COMPLETED: "outline",
  CANCELLED: "destructive",
};

interface ItineraryTabProps {
  tripId: string;
}

const tabCache: Record<string, Day[]> = {};

export function ItineraryTab({ tripId }: ItineraryTabProps) {
  const [days, setDays] = useState<Day[]>(tabCache[tripId] || []);
  const [isLoading, setIsLoading] = useState(!tabCache[tripId]);
  const [addingDay, setAddingDay] = useState(false);
  const [activitySheet, setActivitySheet] = useState<{
    open: boolean;
    dayId: string;
    activity?: Activity;
  }>({ open: false, dayId: "" });

  // Activity form state
  const [actTitle, setActTitle] = useState("");
  const [actDesc, setActDesc] = useState("");
  const [actLocation, setActLocation] = useState("");
  const [actStatus, setActStatus] = useState("PLANNED");
  const [actStartTime, setActStartTime] = useState("");
  const [actEndTime, setActEndTime] = useState("");

  const loadDays = useCallback(async () => {
    try {
      const { data } = await api.get<ApiResponse<Day[]>>(`/days/trip/${tripId}`);
      tabCache[tripId] = data.data;
      setDays(data.data);
    } catch {
      toast.error("Failed to load itinerary");
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    loadDays();
  }, [loadDays]);

  const handleAddDay = async () => {
    setAddingDay(true);
    const nextPosition = days.length + 1;
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + nextPosition);

    const previousDays = [...days];
    setDays((prev) => [
      ...prev,
      { id: `temp-${Date.now()}`, tripId, date: nextDate.toISOString(), position: nextPosition, activities: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ]);

    try {
      await api.post(`/days/trip/${tripId}`, {
        date: nextDate.toISOString(),
        position: nextPosition,
      });
      toast.success("Day added!");
      loadDays();
    } catch {
      setDays(previousDays);
      toast.error("Failed to add day");
    } finally {
      setAddingDay(false);
    }
  };

  const openActivitySheet = (dayId: string, activity?: Activity) => {
    if (activity) {
      setActTitle(activity.title);
      setActDesc(activity.description || "");
      setActLocation(activity.location || "");
      setActStatus(activity.status);
      setActStartTime(activity.startTime ? activity.startTime.slice(0, 16) : "");
      setActEndTime(activity.endTime ? activity.endTime.slice(0, 16) : "");
    } else {
      setActTitle("");
      setActDesc("");
      setActLocation("");
      setActStatus("PLANNED");
      setActStartTime("");
      setActEndTime("");
    }
    setActivitySheet({ open: true, dayId, activity });
  };

  const handleSaveActivity = async () => {
    const payload: Record<string, unknown> = {
      title: actTitle,
      description: actDesc || undefined,
      location: actLocation || undefined,
      status: actStatus,
      startTime: actStartTime ? new Date(actStartTime).toISOString() : undefined,
      endTime: actEndTime ? new Date(actEndTime).toISOString() : undefined,
    };

    const previousDays = [...days];
    const tempId = activitySheet.activity ? activitySheet.activity.id : `temp-${Date.now()}`;
    const dayId = activitySheet.dayId;
    const isEditing = !!activitySheet.activity;

    setDays((prev) => prev.map((d) => {
      if (d.id === dayId) {
        if (isEditing) {
          return {
            ...d,
            activities: (d.activities || []).map((a) => a.id === tempId ? { ...a, ...payload } as any : a)
          };
        } else {
          return {
            ...d,
            activities: [...(d.activities || []), { id: tempId, dayId: d.id, ...payload, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as any]
          };
        }
      }
      return d;
    }));

    setActivitySheet({ open: false, dayId: "" });

    try {
      if (isEditing) {
        await api.patch(`/activities/${tempId}`, payload);
        toast.success("Activity updated!");
      } else {
        await api.post(`/activities/day/${dayId}`, {
          ...payload,
          position: 0,
        });
        toast.success("Activity added!");
      }
      loadDays();
    } catch {
      setDays(previousDays);
      toast.error("Failed to save activity");
    }
  };

  const handleDeleteActivity = async (dayId: string, activityId: string) => {
    const previousDays = [...days];

    setDays((prev) => prev.map((d) => {
      if (d.id === dayId) {
        return {
          ...d,
          activities: (d.activities || []).filter((a) => a.id !== activityId)
        };
      }
      return d;
    }));

    try {
      await api.delete(`/activities/${activityId}`);
      toast.success("Activity deleted");
    } catch {
      setDays(previousDays);
      toast.error("Failed to delete activity");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-full" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-8 w-24 rounded-md" />
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex flex-col gap-1.5 py-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Separator className="my-1" />
              <div className="flex flex-col gap-1.5 py-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {days.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <CalendarDays className="size-7 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No days planned yet. Add your first day!</p>
        </div>
      ) : (
        days.map((day) => (
          <Card key={day.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {day.position}
                </div>
                <CardTitle className="text-base">
                  {format(new Date(day.date), "EEEE, MMM d")}
                </CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openActivitySheet(day.id)}
              >
                <Plus className="mr-1 size-3.5" />
                Activity
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {!day.activities || day.activities.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No activities yet — add one above
                </p>
              ) : (
                day.activities.map((activity, idx) => (
                  <div key={activity.id}>
                    {idx > 0 && <Separator className="my-1" />}
                    <div
                      className="flex cursor-pointer items-center justify-between rounded-md px-2 py-2 transition-colors hover:bg-accent/50"
                      onClick={() => openActivitySheet(day.id, activity)}
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{activity.title}</span>
                          <Badge variant={statusColors[activity.status] as any} className="text-[10px] px-1.5 py-0">
                            {activity.status.toLowerCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {activity.startTime && (
                            <span className="flex items-center gap-1"><Clock className="size-3" />{format(new Date(activity.startTime), "h:mm a")}</span>
                          )}
                          {activity.location && <span className="flex items-center gap-1"><MapPin className="size-3" />{activity.location}</span>}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteActivity(day.id, activity.id);
                        }}
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))
      )}

      <Button variant="outline" onClick={handleAddDay} disabled={addingDay} className="self-start">
        {addingDay ? "Adding…" : <><Plus className="mr-1 size-4" />Add Day</>}
      </Button>

      {/* Activity Sheet */}
      <Sheet
        open={activitySheet.open}
        onOpenChange={(open) => setActivitySheet((prev) => ({ ...prev, open }))}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{activitySheet.activity ? "Edit Activity" : "New Activity"}</SheetTitle>
            <SheetDescription>
              {activitySheet.activity ? "Update the details below" : "Add a new activity to this day"}
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 px-4 py-4">
            <div className="flex flex-col gap-2">
              <Label>Title</Label>
              <Input value={actTitle} onChange={(e) => setActTitle(e.target.value)} placeholder="Visit the museum" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <Textarea value={actDesc} onChange={(e) => setActDesc(e.target.value)} placeholder="What you'll do there…" rows={2} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Location</Label>
              <Input value={actLocation} onChange={(e) => setActLocation(e.target.value)} placeholder="123 Main St" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <Select value={actStatus} onValueChange={setActStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PLANNED">Planned</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label>Start time</Label>
                <Input type="datetime-local" value={actStartTime} onChange={(e) => setActStartTime(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>End time</Label>
                <Input type="datetime-local" value={actEndTime} onChange={(e) => setActEndTime(e.target.value)} />
              </div>
            </div>
          </div>
          <SheetFooter className="px-4">
            <Button onClick={handleSaveActivity} disabled={!actTitle}>
              {activitySheet.activity ? "Update" : "Add Activity"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
