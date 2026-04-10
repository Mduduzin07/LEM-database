"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CalendarCheck, CalendarClock, Users } from "lucide-react";

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

export default function DashboardStats({ data }: { data: Gathering[] }) {
  const now = new Date();
  
  const totalGatherings = data.length;
  const upcomingGatherings = data.filter(event => 
    new Date(event.dateTime) > now && event.eventStatus === "scheduled"
  ).length;
  const completedGatherings = data.filter(event => 
    new Date(event.dateTime) < now || event.eventStatus === "completed"
  ).length;
  const cancelledGatherings = data.filter(event => 
    event.eventStatus === "cancelled"
  ).length;

  const stats = [
    {
      title: "Total Gatherings",
      value: totalGatherings,
      icon: <Calendar className="h-5 w-5 text-blue-600" />,
    },
    {
      title: "Upcoming",
      value: upcomingGatherings,
      icon: <CalendarClock className="h-5 w-5 text-green-600" />,
    },
    {
      title: "Completed",
      value: completedGatherings,
      icon: <CalendarCheck className="h-5 w-5 text-purple-600" />,
    },
    {
      title: "Cancelled",
      value: cancelledGatherings,
      icon: <Users className="h-5 w-5 text-red-600" />,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}