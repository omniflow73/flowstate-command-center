
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Clock, Plus, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";

export default function CalendarCard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"calendar" | "schedule">("calendar");

  // Example events data - in real app, this would come from a database
  const events = [
    { id: 1, date: new Date(), title: "Team Meeting", type: "work", time: "10:00 AM - 11:00 AM", location: "Conference Room A" },
    { id: 2, date: addDays(new Date(), 2), title: "Doctor Appointment", type: "personal", time: "02:30 PM - 03:30 PM", location: "Medical Center" },
    { id: 3, date: addDays(new Date(), 3), title: "Project Deadline", type: "work", time: "05:00 PM", location: "Office" },
    { id: 4, date: addDays(new Date(), 1), title: "Lunch with Client", type: "work", time: "12:30 PM - 02:00 PM", location: "Downtown Restaurant" },
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
  const getEventsForDate = (selectedDate: Date) => {
    return events.filter(
      (event) => 
        event.date.getDate() === selectedDate.getDate() && 
        event.date.getMonth() === selectedDate.getMonth() && 
        event.date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const todaysEvents = date ? getEventsForDate(date) : [];

  const handleAddEvent = () => {
    toast.info("Add new event functionality would open a form here");
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle>Calendar</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant={view === "calendar" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setView("calendar")}
          >
            <CalendarIcon className="h-4 w-4 mr-1" />
            Calendar
          </Button>
          <Button 
            variant={view === "schedule" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setView("schedule")}
          >
            <Clock className="h-4 w-4 mr-1" />
            Schedule
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {view === "calendar" ? (
          <>
            <div className="text-center mb-2">
              {date && <h3 className="font-medium">{format(date, "MMMM yyyy")}</h3>}
            </div>
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
          </>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              {date && (
                <h3 className="font-medium">
                  {format(date, "EEEE, MMMM d, yyyy")}
                </h3>
              )}
            </div>
            <div className="space-y-3">
              {todaysEvents.length > 0 ? (
                todaysEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background/50">
                    <Badge variant={event.type === "work" ? "default" : "secondary"} className="h-2 w-2 rounded-full p-0 mt-2" />
                    <div className="flex-1">
                      <p className="font-medium">{event.title}</p>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        <span>{event.time}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No events scheduled for this day</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          onClick={handleAddEvent} 
          variant="outline" 
          className="w-full flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </CardFooter>
    </Card>
  );
}
