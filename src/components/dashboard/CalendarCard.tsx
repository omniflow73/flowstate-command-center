
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function CalendarCard() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Example events data - in real app, this would come from a database
  const events = [
    { date: new Date(), title: "Team Meeting", type: "work" },
    { date: new Date(new Date().setDate(new Date().getDate() + 2)), title: "Doctor Appointment", type: "personal" },
    { date: new Date(new Date().setDate(new Date().getDate() + 3)), title: "Project Deadline", type: "work" },
  ];

  // Helper function to check if a date has events
  const hasEvent = (day: Date) => {
    return events.some(
      (event) => 
        event.date.getDate() === day.getDate() && 
        event.date.getMonth() === day.getMonth() && 
        event.date.getFullYear() === day.getFullYear()
    );
  };

  // Get today's events
  const todaysEvents = events.filter(
    (event) => 
      event.date.getDate() === new Date().getDate() && 
      event.date.getMonth() === new Date().getMonth() && 
      event.date.getFullYear() === new Date().getFullYear()
  );

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          modifiers={{
            hasEvent: (date) => hasEvent(date),
          }}
          modifiersStyles={{
            hasEvent: { textDecoration: "underline", fontWeight: "bold" },
          }}
        />
        
        {todaysEvents.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Today's Events</h4>
            <div className="space-y-2">
              {todaysEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-2 p-2 rounded-lg border border-border bg-background/50">
                  <Badge variant={event.type === "work" ? "default" : "secondary"} className="h-2 w-2 rounded-full p-0" />
                  <span>{event.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
