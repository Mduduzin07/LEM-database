
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

type Gathering = {
  _id: string;
  eventName: string;
  date: string;
  time: string;
  dateTime: string;
  location: string;
  organiser: string;
  eventStatus: string;
};

export default function NextEvent({ data }: { data: Gathering[] }) {
  // Find the next upcoming event
  const now = new Date();
  const upcomingEvents = data
    .filter(event => new Date(event.dateTime) > now && event.eventStatus === "scheduled")
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  
  const nextEvent = upcomingEvents[0];

  if (!nextEvent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Next Gathering</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No upcoming gatherings scheduled</p>
        </CardContent>
      </Card>
    );
  }

  const eventDate = new Date(nextEvent.dateTime);
  const formattedDate = eventDate.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = eventDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <Card className="border-l-4 border-l-amber-500">
      <CardHeader>
        <CardTitle className="text-xl">Next Gathering</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg">{nextEvent.eventName}</h3>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{formattedDate}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{formattedTime}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{nextEvent.location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-sm">Organized by: {nextEvent.organiser}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}