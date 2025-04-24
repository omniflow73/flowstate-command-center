
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCheck, CheckCircle, CheckCircle2, Circle, Plus, Lightbulb } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Habit = {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
  completedDates: string[];
};

const habitSuggestions = [
  { name: "Morning meditation", description: "Start your day with clarity" },
  { name: "Daily exercise", description: "Stay active for 30 minutes" },
  { name: "Read 20 pages", description: "Expand your knowledge daily" },
  { name: "Drink 8 glasses of water", description: "Stay hydrated" },
  { name: "Journal", description: "Document your thoughts and progress" },
  { name: "Practice gratitude", description: "Write down 3 things you're grateful for" },
  { name: "Tech-free time", description: "Disconnect for 1 hour" },
  { name: "Learn something new", description: "Dedicate time to learning" },
];

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
  
  const [newHabitName, setNewHabitName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  const addNewHabit = () => {
    if (!newHabitName.trim()) {
      toast.error("Please enter a habit name");
      return;
    }
    
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName,
      streak: 0,
      completedToday: false,
      completedDates: [],
    };
    
    setHabits([...habits, newHabit]);
    setNewHabitName("");
    setDialogOpen(false);
    toast.success(`New habit "${newHabitName}" added`);
  };

  const addSuggestedHabit = (suggestion: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: suggestion,
      streak: 0,
      completedToday: false,
      completedDates: [],
    };
    
    setHabits([...habits, newHabit]);
    setDialogOpen(false);
    toast.success(`New habit "${suggestion}" added`);
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
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle>Habit Tracker</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Plus size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Habit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input 
                placeholder="Enter habit name..." 
                value={newHabitName} 
                onChange={(e) => setNewHabitName(e.target.value)} 
              />
              
              <Button 
                onClick={() => setShowSuggestions(!showSuggestions)}
                variant="outline"
                type="button"
                className="w-full flex justify-center items-center gap-2"
              >
                <Lightbulb className="h-4 w-4" />
                {showSuggestions ? "Hide Suggestions" : "Show Suggestions"}
              </Button>
              
              {showSuggestions && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-medium">Popular Habits</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {habitSuggestions.map((suggestion, index) => (
                      <div 
                        key={index} 
                        className="p-2 border rounded-md cursor-pointer hover:bg-accent"
                        onClick={() => addSuggestedHabit(suggestion.name)}
                      >
                        <p className="font-medium text-sm">{suggestion.name}</p>
                        <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={addNewHabit}>Add Habit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                  <span className="font-medium">{habit.streak}</span>
                  <Badge variant="outline" className="text-xs">
                    {habit.streak === 1 ? "day" : "days"}
                  </Badge>
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
          
          {habits.length === 0 && (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No habits added yet</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Your First Habit
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
