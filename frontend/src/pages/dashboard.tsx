import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTrips } from "@/store/trips-slice";
import { TripCard } from "@/components/trips/trip-card";
import { CreateTripDialog } from "@/components/trips/create-trip-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Map, Plus } from "lucide-react";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { trips, isLoading } = useAppSelector((state) => state.trips);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Trips</h1>
          <p className="text-sm text-muted-foreground">Plan and manage your upcoming adventures</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-1 size-4" />
          New Trip
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted">
            <Map className="size-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-medium">No trips yet</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Your adventures start here. Create your first trip and invite friends to plan together.
          </p>
          <Button onClick={() => setCreateOpen(true)}>Create your first trip</Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in zoom-in-95 duration-300">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}

      <CreateTripDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
