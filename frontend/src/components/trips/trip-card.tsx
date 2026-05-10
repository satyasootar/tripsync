import { useNavigate } from "react-router";
import { format } from "date-fns";
import { MapPin, Plane } from "lucide-react";
import type { Trip } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TripCardProps {
  trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
      onClick={() => navigate(`/trips/${trip.id}`)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
              <Plane className="size-4 text-primary" />
            </div>
            <CardTitle className="text-lg">{trip.title}</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {trip.visibility.toLowerCase()}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="size-3.5" />
          {trip.destination}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {format(new Date(trip.startDate), "MMM d")} — {format(new Date(trip.endDate), "MMM d, yyyy")}
        </p>
        {trip.description && (
          <p className="mt-2 truncate text-sm">{trip.description}</p>
        )}
      </CardContent>
    </Card>
  );
}
