
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCheck, CheckCircle, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Habit = {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
  completedDates: string[];
};

export default function HabitTrackerCard() {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "1",
      name: "Meditation",
      streak: 7,
      completedToday: true,
      completedDates: Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }),
    },
    {
      id: "2",
      name: "Exercise",
      streak: 3,
      completedToday: false,
      completedDates: Array.from({ length: 3 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i - 1);
        return date.toISOString().split('T')[0];
      }),
    },
    {
      id: "3",
      name: "Reading",
      streak: 5,
      completedToday: true,
      completedDates: Array.from({ length: 5 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }),
    },
  ]);

  const toggleHabit = (habitId: string) => {
    setHabits(prevHabits => {
      return prevHabits.map(habit => {
        if (habit.id === habitId) {
          const wasCompleted = habit.completedToday;
          const newStreak = wasCompleted ? habit.streak - 1 : habit.streak + 1;
          const today = new Date().toISOString().split('T')[0];
          
          const newDates = wasCompleted
            ? habit.completedDates.filter(date => date !== today)
            : [...habit.completedDates, today];

          toast.success(`${habit.name} marked as ${wasCompleted ? 'incomplete' : 'complete'}`);
          
          return {
            ...habit,
            completedToday: !wasCompleted,
            streak: newStreak,
            completedDates: newDates,
          };
        }
        return habit;
      });
    });
  };

  // Generate last 7 days for the habit calendar
  const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      date,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dateString: date.toISOString().split('T')[0],
    };
  }).reverse();

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle>Habit Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {habits.map((habit) => (
            <div key={habit.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => toggleHabit(habit.id)}
                  className="flex items-center gap-2 hover:opacity-80"
                >
                  {habit.completedToday ? (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span>{habit.name}</span>
                </button>
                <div className="flex items-center gap-1.5 text-sm">
                  <CheckCheck className="h-4 w-4" />
                  <span>{habit.streak} day streak</span>
                </div>
              </div>
              
              <div className="flex gap-1 justify-between">
                {lastSevenDays.map((day, index) => {
                  const isCompleted = habit.completedDates.includes(day.dateString);
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <span className="text-xs text-muted-foreground">
                        {day.dayName.charAt(0)}
                      </span>
                      <div className={`h-6 w-6 flex items-center justify-center rounded-full ${
                        isCompleted ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}>
                        {isCompleted && <CheckCircle2 className="h-4 w-4" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
