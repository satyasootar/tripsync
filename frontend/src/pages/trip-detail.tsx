import { useEffect } from "react";
import { useParams } from "react-router";
import { format } from "date-fns";
import { MapPin } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTrip } from "@/store/trips-slice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ItineraryTab } from "@/components/itinerary/itinerary-tab";
import { ExpensesTab } from "@/components/expenses/expenses-tab";
import { ChecklistsTab } from "@/components/checklists/checklists-tab";
import { MembersTab } from "@/components/members/members-tab";

export default function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const dispatch = useAppDispatch();
  const { currentTrip: trip, isLoading } = useAppSelector((state) => state.trips);

  useEffect(() => {
    if (tripId) dispatch(fetchTrip(tripId));
  }, [dispatch, tripId]);

  if (isLoading || !trip) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Trip Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{trip.title}</h1>
          <Badge variant="secondary">{trip.visibility.toLowerCase()}</Badge>
        </div>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="size-3.5" />{trip.destination}</span>
          <span>•</span>
          <span>
            {format(new Date(trip.startDate), "MMM d")} — {format(new Date(trip.endDate), "MMM d, yyyy")}
          </span>
        </p>
        {trip.description && (
          <p className="mt-1 text-sm text-muted-foreground">{trip.description}</p>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="itinerary" className="flex flex-col gap-4">
        <TabsList className="w-fit">
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="checklists">Checklists</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="itinerary" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <ItineraryTab tripId={trip.id} />
        </TabsContent>

        <TabsContent value="expenses" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <ExpensesTab tripId={trip.id} />
        </TabsContent>

        <TabsContent value="checklists" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <ChecklistsTab tripId={trip.id} />
        </TabsContent>

        <TabsContent value="members" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <MembersTab tripId={trip.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
