
import React, { useState, useEffect } from "react";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCheck, CheckCircle, CheckCircle2, Circle, Plus, X, Edit, Lightbulb, Calendar as CalendarIcon, BarChart2, Activity } from "lucide-react";
import { toast } from "sonner";
import { format, isSameDay, addDays, subDays, parseISO, isWithinInterval } from "date-fns";

interface Habit {
  id: string;
  name: string;
  description?: string;
  category: string;
  frequency: "daily" | "weekly" | "custom";
  activeDays: number[]; // 0 = Sunday, 1 = Monday, etc.
  streak: number;
  longestStreak: number;
  startDate: string;
  completedDates: string[];
  completedToday: boolean;
  color?: string;
  timeOfDay?: "morning" | "afternoon" | "evening" | "anytime";
  reminder?: boolean;
}

const habitCategories = [
  { value: "health", label: "Health & Fitness" },
  { value: "productivity", label: "Productivity" },
  { value: "learning", label: "Learning" },
  { value: "mindfulness", label: "Mindfulness" },
  { value: "personal", label: "Personal" },
];

const habitSuggestions = [
  { name: "Morning meditation", description: "Start your day with clarity", category: "mindfulness", timeOfDay: "morning" },
  { name: "Daily exercise", description: "Stay active for 30 minutes", category: "health", timeOfDay: "anytime" },
  { name: "Read 20 pages", description: "Expand your knowledge daily", category: "learning", timeOfDay: "evening" },
  { name: "Drink 8 glasses of water", description: "Stay hydrated", category: "health", timeOfDay: "anytime" },
  { name: "Journal", description: "Document your thoughts and progress", category: "mindfulness", timeOfDay: "evening" },
  { name: "Practice gratitude", description: "Write down 3 things you're grateful for", category: "mindfulness", timeOfDay: "evening" },
  { name: "Tech-free time", description: "Disconnect for 1 hour", category: "personal", timeOfDay: "evening" },
  { name: "Learn something new", description: "Dedicate time to learning", category: "learning", timeOfDay: "anytime" },
];

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "1",
      name: "Meditation",
      description: "10 minutes of mindfulness meditation",
      category: "mindfulness",
      frequency: "daily",
      activeDays: [0, 1, 2, 3, 4, 5, 6],
      streak: 7,
      longestStreak: 14,
      startDate: "2023-01-01",
      completedDates: Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }),
      completedToday: true,
      timeOfDay: "morning",
    },
    {
      id: "2",
      name: "Exercise",
      description: "30 minutes of physical activity",
      category: "health",
      frequency: "daily",
      activeDays: [0, 1, 2, 3, 4, 5, 6],
      streak: 3,
      longestStreak: 10,
      startDate: "2023-01-15",
      completedDates: Array.from({ length: 3 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i - 1);
        return date.toISOString().split('T')[0];
      }),
      completedToday: false,
      timeOfDay: "afternoon",
    },
    {
      id: "3",
      name: "Reading",
      description: "Read at least 20 pages",
      category: "learning",
      frequency: "daily",
      activeDays: [0, 1, 2, 3, 4, 5, 6],
      streak: 5,
      longestStreak: 21,
      startDate: "2023-02-01",
      completedDates: Array.from({ length: 5 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }),
      completedToday: true,
      timeOfDay: "evening",
    },
    {
      id: "4",
      name: "Weekly Review",
      description: "Review goals and progress",
      category: "productivity",
      frequency: "weekly",
      activeDays: [0], // Sunday
      streak: 4,
      longestStreak: 8,
      startDate: "2023-03-01",
      completedDates: ["2023-05-21", "2023-05-14", "2023-05-07", "2023-04-30"],
      completedToday: false,
      timeOfDay: "evening",
    },
  ]);
  
  const [activeTab, setActiveTab] = useState("all");
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isAddHabitDialogOpen, setIsAddHabitDialogOpen] = useState(false);
  const [newHabit, setNewHabit] = useState<Partial<Habit>>({
    name: "",
    description: "",
    category: "personal",
    frequency: "daily",
    activeDays: [0, 1, 2, 3, 4, 5, 6],
    timeOfDay: "anytime",
    reminder: false,
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [stats, setStats] = useState({
    totalHabits: habits.length,
    completedToday: habits.filter(h => h.completedToday).length,
    totalStreak: habits.reduce((acc, curr) => acc + curr.streak, 0),
    streakAverage: habits.length > 0 ? habits.reduce((acc, curr) => acc + curr.streak, 0) / habits.length : 0,
    completionRate: 0,
  });
  
  // Update stats when habits change
  useEffect(() => {
    // Calculate completion rate for the last 7 days
    const today = new Date();
    const sevenDaysAgo = subDays(today, 7);
    
    let totalPossibleCompletions = 0;
    let actualCompletions = 0;
    
    habits.forEach(habit => {
      // Count how many days in the last 7 days this habit should have been completed
      for (let i = 0; i < 7; i++) {
        const date = subDays(today, i);
        const dayOfWeek = date.getDay();
        
        if (habit.activeDays.includes(dayOfWeek)) {
          totalPossibleCompletions++;
          
          // Check if it was completed on this day
          if (habit.completedDates.some(completedDate => 
            isSameDay(parseISO(completedDate), date)
          )) {
            actualCompletions++;
          }
        }
      }
    });
    
    const completionRate = totalPossibleCompletions > 0 
      ? Math.round((actualCompletions / totalPossibleCompletions) * 100) 
      : 0;
    
    setStats({
      totalHabits: habits.length,
      completedToday: habits.filter(h => h.completedToday).length,
      totalStreak: habits.reduce((acc, curr) => acc + curr.streak, 0),
      streakAverage: habits.length > 0 ? Math.round(habits.reduce((acc, curr) => acc + curr.streak, 0) / habits.length) : 0,
      completionRate,
    });
  }, [habits]);
  
  const toggleHabit = (habitId: string) => {
    setHabits(prevHabits => {
      return prevHabits.map(habit => {
        if (habit.id === habitId) {
          const today = new Date().toISOString().split('T')[0];
          const wasCompleted = habit.completedToday;
          
          // Update streak
          let newStreak = habit.streak;
          if (wasCompleted) {
            newStreak = Math.max(0, habit.streak - 1);
          } else {
            newStreak = habit.streak + 1;
          }
          
          // Update completed dates
          const newCompletedDates = wasCompleted
            ? habit.completedDates.filter(date => date !== today)
            : [...habit.completedDates, today];
          
          toast.success(`${habit.name} marked as ${wasCompleted ? 'incomplete' : 'complete'}`);
          
          return {
            ...habit,
            completedToday: !wasCompleted,
            streak: newStreak,
            longestStreak: Math.max(habit.longestStreak, newStreak),
            completedDates: newCompletedDates,
          };
        }
        return habit;
      });
    });
  };
  
  const addNewHabit = () => {
    // Validate habit
    if (!newHabit.name?.trim()) {
      toast.error("Please enter a habit name");
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    const habitToAdd: Habit = {
      id: `habit-${Date.now()}`,
      name: newHabit.name,
      description: newHabit.description || "",
      category: newHabit.category || "personal",
      frequency: newHabit.frequency || "daily",
      activeDays: newHabit.activeDays || [0, 1, 2, 3, 4, 5, 6],
      streak: 0,
      longestStreak: 0,
      startDate: today,
      completedDates: [],
      completedToday: false,
      timeOfDay: newHabit.timeOfDay || "anytime",
      reminder: newHabit.reminder || false,
    };
    
    setHabits([...habits, habitToAdd]);
    toast.success(`New habit "${newHabit.name}" added`);
    
    // Reset form
    setNewHabit({
      name: "",
      description: "",
      category: "personal",
      frequency: "daily",
      activeDays: [0, 1, 2, 3, 4, 5, 6],
      timeOfDay: "anytime",
      reminder: false,
    });
    setIsAddHabitDialogOpen(false);
  };
  
  const addSuggestedHabit = (suggestion: typeof habitSuggestions[0]) => {
    const today = new Date().toISOString().split('T')[0];
    
    const habitToAdd: Habit = {
      id: `habit-${Date.now()}`,
      name: suggestion.name,
      description: suggestion.description,
      category: suggestion.category,
      frequency: "daily",
      activeDays: [0, 1, 2, 3, 4, 5, 6],
      streak: 0,
      longestStreak: 0,
      startDate: today,
      completedDates: [],
      completedToday: false,
      timeOfDay: suggestion.timeOfDay as any || "anytime",
      reminder: false,
    };
    
    setHabits([...habits, habitToAdd]);
    toast.success(`New habit "${suggestion.name}" added`);
    setIsAddHabitDialogOpen(false);
  };
  
  const updateHabit = () => {
    if (!editingHabit) return;
    
    setHabits(habits.map(habit => 
      habit.id === editingHabit.id ? editingHabit : habit
    ));
    
    toast.success(`Habit "${editingHabit.name}" updated`);
    setEditingHabit(null);
  };
  
  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
    toast.success("Habit deleted");
    setSelectedHabit(null);
    setEditingHabit(null);
  };
  
  const habitsByCategory = () => {
    return habitCategories.map(category => ({
      ...category,
      habits: habits.filter(habit => habit.category === category.value),
    }));
  };
  
  const filteredHabits = () => {
    switch (activeTab) {
      case "all":
        return habits;
      case "today":
        return habits.filter(habit => {
          const today = new Date().getDay();
          return habit.activeDays.includes(today);
        });
      case "completed":
        return habits.filter(habit => habit.completedToday);
      case "pending":
        const today = new Date().getDay();
        return habits.filter(habit => 
          habit.activeDays.includes(today) && !habit.completedToday
        );
      default:
        return habits;
    }
  };
  
  const getHabitsForDate = (date: Date) => {
    const dayOfWeek = date.getDay();
    const dateString = format(date, "yyyy-MM-dd");
    
    return habits.filter(habit => {
      // Check if habit was active on this date (after start date)
      const habitStartDate = new Date(habit.startDate);
      if (date < habitStartDate) return false;
      
      // Check if this day is an active day for the habit
      return habit.activeDays.includes(dayOfWeek);
    }).map(habit => ({
      ...habit,
      completed: habit.completedDates.includes(dateString),
    }));
  };
  
  const getDayCompletion = (date: Date) => {
    const habitsForDate = getHabitsForDate(date);
    if (!habitsForDate.length) return 0;
    
    const completed = habitsForDate.filter(h => h.completed).length;
    return (completed / habitsForDate.length) * 100;
  };
  
  // Generate last 7 days for the habit calendar visualization
  const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      date,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dateString: date.toISOString().split('T')[0],
    };
  }).reverse();
  
  const handleDaySelect = (day: Date | undefined) => {
    if (day) {
      setSelectedDate(day);
    }
  };
  
  // Get CSS class for category badge
  const getCategoryClass = (category: string) => {
    switch (category) {
      case "health":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "productivity":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "learning":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "mindfulness":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <BackButton />
      <h1 className="text-3xl font-bold mb-2">Habits Dashboard</h1>
      <p className="text-muted-foreground mb-6">Track and build consistent habits</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center">
                  <p className="text-muted-foreground text-sm">Total Habits</p>
                  <p className="text-3xl font-bold">{stats.totalHabits}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center">
                  <p className="text-muted-foreground text-sm">Completed Today</p>
                  <p className="text-3xl font-bold">{stats.completedToday}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center">
                  <p className="text-muted-foreground text-sm">Avg Streak</p>
                  <p className="text-3xl font-bold">{stats.streakAverage}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center">
                  <p className="text-muted-foreground text-sm">Completion Rate</p>
                  <p className="text-3xl font-bold">{stats.completionRate}%</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs and Habit List */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle>Your Habits</CardTitle>
              <Dialog open={isAddHabitDialogOpen} onOpenChange={setIsAddHabitDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Habit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Habit</DialogTitle>
                    <DialogDescription>
                      Create a new habit to track and build consistency
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter habit name..."
                        value={newHabit.name}
                        onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (optional)</Label>
                      <Input
                        id="description"
                        placeholder="Enter a short description..."
                        value={newHabit.description}
                        onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newHabit.category}
                          onValueChange={(value) => setNewHabit({...newHabit, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {habitCategories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="frequency">Frequency</Label>
                        <Select
                          value={newHabit.frequency}
                          onValueChange={(value: "daily" | "weekly" | "custom") => {
                            const activeDays = value === "daily" ? [0,1,2,3,4,5,6] : 
                                             value === "weekly" ? [0] : 
                                             [0,1,2,3,4,5,6];
                            setNewHabit({...newHabit, frequency: value, activeDays});
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {newHabit.frequency === "custom" && (
                      <div className="space-y-2">
                        <Label>Active Days</Label>
                        <div className="flex flex-wrap gap-2">
                          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                            <div key={day} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`day-${index}`}
                                checked={newHabit.activeDays?.includes(index)}
                                onCheckedChange={(checked) => {
                                  const newActiveDays = [...(newHabit.activeDays || [])];
                                  if (checked) {
                                    if (!newActiveDays.includes(index)) {
                                      newActiveDays.push(index);
                                    }
                                  } else {
                                    const dayIndex = newActiveDays.indexOf(index);
                                    if (dayIndex > -1) {
                                      newActiveDays.splice(dayIndex, 1);
                                    }
                                  }
                                  setNewHabit({...newHabit, activeDays: newActiveDays});
                                }}
                              />
                              <Label htmlFor={`day-${index}`}>{day}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => setShowSuggestions(!showSuggestions)}
                    >
                      <Lightbulb className="h-4 w-4 mr-1" />
                      {showSuggestions ? "Hide Suggestions" : "Show Suggestions"}
                    </Button>
                    
                    {showSuggestions && (
                      <div className="mt-4 space-y-2">
                        <h3 className="text-sm font-medium">Popular Habits</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {habitSuggestions.map((suggestion, index) => (
                            <div 
                              key={index} 
                              className="p-2 border rounded-md cursor-pointer hover:bg-accent"
                              onClick={() => addSuggestedHabit(suggestion)}
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
                    <Button variant="outline" onClick={() => setIsAddHabitDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addNewHabit}>Add Habit</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4 w-full">
                  <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                  <TabsTrigger value="today" className="flex-1">Today</TabsTrigger>
                  <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
                  <TabsTrigger value="pending" className="flex-1">Pending</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab}>
                  {filteredHabits().length > 0 ? (
                    <div className="space-y-4">
                      {filteredHabits().map((habit) => (
                        <div 
                          key={habit.id} 
                          className="border rounded-lg p-3 flex items-center justify-between hover:bg-accent/50 cursor-pointer"
                          onClick={() => setSelectedHabit(habit)}
                        >
                          <div className="flex items-center gap-3">
                            <button 
                              className="flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleHabit(habit.id);
                              }}
                            >
                              {habit.completedToday ? (
                                <CheckCircle className="h-5 w-5 text-primary" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground" />
                              )}
                            </button>
                            
                            <div>
                              <p className="font-medium">{habit.name}</p>
                              {habit.description && (
                                <p className="text-xs text-muted-foreground">{habit.description}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getCategoryClass(habit.category)}`}
                            >
                              {habitCategories.find(c => c.value === habit.category)?.label || habit.category}
                            </Badge>
                            
                            <div className="flex items-center gap-1 text-sm">
                              <CheckCheck className="h-4 w-4" />
                              <span className="font-medium">{habit.streak}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No habits found</p>
                      <Button 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => setIsAddHabitDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Your First Habit
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Side Column */}
        <div className="space-y-6">
          {/* Calendar and Habit View */}
          <Card>
            <CardHeader>
              <CardTitle>Habit Calendar</CardTitle>
              <CardDescription>View your habits by date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDaySelect}
                  className="rounded-md border w-full"
                />
              </div>
              
              <div className="mt-4">
                <h3 className="font-semibold mb-2">
                  {format(selectedDate, "EEEE, MMMM d")}
                </h3>
                
                {getHabitsForDate(selectedDate).length > 0 ? (
                  <div className="space-y-2">
                    {getHabitsForDate(selectedDate).map((habit, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm p-2 border rounded">
                        <span>{habit.name}</span>
                        {habit.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-2">
                    No habits scheduled for this day
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Habit Details */}
          {selectedHabit && (
            <Card>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle>{selectedHabit.name}</CardTitle>
                  <CardDescription>{selectedHabit.description}</CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setEditingHabit({...selectedHabit})}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setSelectedHabit(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <Badge 
                      variant="outline" 
                      className={getCategoryClass(selectedHabit.category)}
                    >
                      {habitCategories.find(c => c.value === selectedHabit.category)?.label || selectedHabit.category}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Frequency</p>
                    <p className="font-medium">{selectedHabit.frequency.charAt(0).toUpperCase() + selectedHabit.frequency.slice(1)}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold">{selectedHabit.streak}</div>
                    <span className="text-muted-foreground">days</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Longest: {selectedHabit.longestStreak} days</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">7-Day History</p>
                  <div className="flex justify-between">
                    {lastSevenDays.map((day, index) => {
                      const isCompleted = selectedHabit.completedDates.includes(day.dateString);
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
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deleteHabit(selectedHabit.id)}
                >
                  Delete Habit
                </Button>
                <Button 
                  variant={selectedHabit.completedToday ? "outline" : "default"} 
                  size="sm"
                  onClick={() => toggleHabit(selectedHabit.id)}
                >
                  {selectedHabit.completedToday ? "Mark Incomplete" : "Mark Complete"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
      
      {/* Edit Habit Dialog */}
      <Dialog open={!!editingHabit} onOpenChange={(open) => !open && setEditingHabit(null)}>
        {editingHabit && (
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Habit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingHabit.name}
                  onChange={(e) => setEditingHabit({...editingHabit, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editingHabit.description}
                  onChange={(e) => setEditingHabit({...editingHabit, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={editingHabit.category}
                    onValueChange={(value) => setEditingHabit({...editingHabit, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {habitCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-frequency">Frequency</Label>
                  <Select
                    value={editingHabit.frequency}
                    onValueChange={(value: "daily" | "weekly" | "custom") => {
                      const activeDays = value === "daily" ? [0,1,2,3,4,5,6] : 
                                      value === "weekly" ? [0] : 
                                      editingHabit.activeDays;
                      setEditingHabit({...editingHabit, frequency: value, activeDays});
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {editingHabit.frequency === "custom" && (
                <div className="space-y-2">
                  <Label>Active Days</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`edit-day-${index}`}
                          checked={editingHabit.activeDays.includes(index)}
                          onCheckedChange={(checked) => {
                            const newActiveDays = [...editingHabit.activeDays];
                            if (checked) {
                              if (!newActiveDays.includes(index)) {
                                newActiveDays.push(index);
                              }
                            } else {
                              const dayIndex = newActiveDays.indexOf(index);
                              if (dayIndex > -1) {
                                newActiveDays.splice(dayIndex, 1);
                              }
                            }
                            setEditingHabit({...editingHabit, activeDays: newActiveDays});
                          }}
                        />
                        <Label htmlFor={`edit-day-${index}`}>{day}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingHabit(null)}>
                Cancel
              </Button>
              <Button onClick={updateHabit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
