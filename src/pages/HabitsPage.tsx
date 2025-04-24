
import React, { useState, useEffect } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogFooter, DialogTrigger 
} from "@/components/ui/dialog";
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import { 
  CheckCircle, Circle, Plus, Lightbulb,
  Calendar, BarChart2, CheckCheck, ChevronRight,
  Flame, Trophy, Award, Clock, X, Info
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Popover, PopoverContent, PopoverTrigger 
} from "@/components/ui/popover";

interface Habit {
  id: string;
  name: string;
  category: string;
  frequency: {
    type: 'daily' | 'weekly' | 'custom';
    days?: number[];
    times?: number;
  };
  description?: string;
  streak: number;
  completedDates: string[];
  startDate: string;
  cue?: string;
  reward?: string;
}

const habitCategories = [
  { name: "Health & Fitness", icon: <Flame className="h-4 w-4" /> },
  { name: "Mental Wellbeing", icon: <Award className="h-4 w-4" /> },
  { name: "Productivity", icon: <CheckCheck className="h-4 w-4" /> },
  { name: "Learning", icon: <Trophy className="h-4 w-4" /> },
  { name: "Self-Care", icon: <Calendar className="h-4 w-4" /> }
];

const daysOfWeek = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

const habitSuggestions = [
  {
    name: "Morning Meditation",
    category: "Mental Wellbeing",
    description: "Start your day with 10 minutes of mindfulness",
    cue: "After waking up, before checking phone",
    reward: "Increased focus for the day ahead"
  },
  {
    name: "Daily Exercise",
    category: "Health & Fitness",
    description: "30 minutes of physical activity",
    cue: "After work/study",
    reward: "Boost of endorphins and better sleep"
  },
  {
    name: "Read 20 Pages",
    category: "Learning",
    description: "Read at least 20 pages of a book",
    cue: "Before bedtime",
    reward: "Expanded knowledge and improved sleep"
  },
  {
    name: "Hydration",
    category: "Health & Fitness",
    description: "Drink 8 glasses of water throughout the day",
    cue: "Keep a water bottle visible at desk",
    reward: "Better energy levels and clearer skin"
  },
  {
    name: "Gratitude Journal",
    category: "Mental Wellbeing",
    description: "Write down 3 things you're grateful for",
    cue: "After brushing teeth in the evening",
    reward: "Improved mood and perspective"
  },
  {
    name: "Tech-Free Time",
    category: "Self-Care",
    description: "30 minutes with no screens before bed",
    cue: "Set an evening alarm at 9:30 PM",
    reward: "Better sleep quality and reduced anxiety"
  },
  {
    name: "Stretching Routine",
    category: "Health & Fitness",
    description: "5-minute stretching session",
    cue: "After lunch break",
    reward: "Reduced tension and improved posture"
  },
  {
    name: "Learning Something New",
    category: "Learning",
    description: "Spend 15 minutes learning a new skill",
    cue: "During commute or coffee break",
    reward: "Sense of accomplishment and progress"
  },
  {
    name: "Tidy Up",
    category: "Productivity",
    description: "10-minute cleaning session",
    cue: "Before leaving home or after dinner",
    reward: "Cleaner environment and peace of mind"
  },
  {
    name: "Connect with Someone",
    category: "Self-Care",
    description: "Reach out to a friend or family member",
    cue: "During lunch break",
    reward: "Strengthened relationships and social wellbeing"
  }
];

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newHabitDialog, setNewHabitDialog] = useState(false);
  const [suggestionsDialog, setSuggestionsDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Health & Fitness");
  const [habitName, setHabitName] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [frequencyType, setFrequencyType] = useState<'daily' | 'weekly' | 'custom'>('daily');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [weeklyTimes, setWeeklyTimes] = useState(1);
  const [habitCue, setHabitCue] = useState("");
  const [habitReward, setHabitReward] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const checkIfCompletedToday = (habit: Habit): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completedDates.includes(today);
  };

  const toggleHabit = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    const isCompleted = checkIfCompletedToday(habit);
    
    setHabits(prevHabits => 
      prevHabits.map(h => {
        if (h.id === habit.id) {
          let newCompletedDates;
          let newStreak;
          
          if (isCompleted) {
            // Unchecking the habit for today
            newCompletedDates = h.completedDates.filter(date => date !== today);
            newStreak = Math.max(0, h.streak - 1);
            toast({
              title: "Habit unchecked",
              description: `"${h.name}" marked as incomplete for today`,
            });
          } else {
            // Checking the habit for today
            newCompletedDates = [...h.completedDates, today];
            newStreak = h.streak + 1;
            toast({
              title: "Habit completed!",
              description: `Great job! You've maintained a ${newStreak} day streak.`,
            });
          }
          
          return {
            ...h,
            completedDates: newCompletedDates,
            streak: newStreak,
          };
        }
        return h;
      })
    );
  };

  const addHabit = () => {
    if (!habitName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a habit name",
        variant: "destructive",
      });
      return;
    }

    const frequency = {
      type: frequencyType,
      ...(frequencyType === 'weekly' ? { times: weeklyTimes } : {}),
      ...(frequencyType === 'custom' ? { days: selectedDays } : {})
    };

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: habitName,
      category: selectedCategory,
      frequency,
      description: habitDescription,
      cue: habitCue,
      reward: habitReward,
      streak: 0,
      completedDates: [],
      startDate: new Date().toISOString().split('T')[0],
    };

    setHabits(prev => [...prev, newHabit]);
    resetForm();
    setNewHabitDialog(false);
    
    toast({
      title: "Habit created",
      description: `"${habitName}" has been added to your habits`,
    });
  };

  const addSuggestedHabit = (suggestion: typeof habitSuggestions[0]) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: suggestion.name,
      category: suggestion.category,
      frequency: {
        type: 'daily',
      },
      description: suggestion.description,
      cue: suggestion.cue,
      reward: suggestion.reward,
      streak: 0,
      completedDates: [],
      startDate: new Date().toISOString().split('T')[0],
    };

    setHabits(prev => [...prev, newHabit]);
    setSuggestionsDialog(false);
    
    toast({
      title: "Habit added",
      description: `"${suggestion.name}" has been added from suggestions`,
    });
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
    toast({
      title: "Habit deleted",
      description: "The habit has been removed",
    });
  };

  const resetForm = () => {
    setHabitName("");
    setHabitDescription("");
    setSelectedCategory("Health & Fitness");
    setFrequencyType('daily');
    setSelectedDays([]);
    setWeeklyTimes(1);
    setHabitCue("");
    setHabitReward("");
  };

  const filteredHabits = habits.filter(habit => {
    if (activeTab === "active") {
      return true;
    } else if (activeTab === "completed") {
      return checkIfCompletedToday(habit);
    } else {
      return !checkIfCompletedToday(habit);
    }
  });
  
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

  // Calculate completion rate
  const calculateCompletionRate = () => {
    if (habits.length === 0) return 0;
    
    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(habit => habit.completedDates.includes(today)).length;
    return (completedToday / habits.length) * 100;
  };

  const completionRate = calculateCompletionRate();

  return (
    <div className="container px-4 py-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Habit Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Build lasting habits with consistent tracking and reinforcement
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog open={suggestionsDialog} onOpenChange={setSuggestionsDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Lightbulb className="mr-2 h-4 w-4" />
                Suggestions
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Habit Suggestions</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 max-h-[60vh] overflow-y-auto">
                {habitSuggestions.map((suggestion, index) => (
                  <Card 
                    key={index} 
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => addSuggestedHabit(suggestion)}
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{suggestion.name}</CardTitle>
                        <Badge variant="outline">{suggestion.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                      <div className="mt-3 text-xs">
                        <div className="flex items-start gap-1">
                          <span className="font-semibold">Cue:</span>
                          <span>{suggestion.cue}</span>
                        </div>
                        <div className="flex items-start gap-1">
                          <span className="font-semibold">Reward:</span>
                          <span>{suggestion.reward}</span>
                        </div>
                      </div>
                      <Button className="w-full mt-3" size="sm">
                        Add This Habit
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={newHabitDialog} onOpenChange={setNewHabitDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Habit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Habit</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Name</label>
                  <Input 
                    placeholder="Habit name" 
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {habitCategories.map(category => (
                        <SelectItem key={category.name} value={category.name}>
                          <div className="flex items-center gap-2">
                            {category.icon}
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Description (optional)</label>
                  <Input 
                    placeholder="Brief description" 
                    value={habitDescription}
                    onChange={(e) => setHabitDescription(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Frequency</label>
                  <Select
                    value={frequencyType}
                    onValueChange={(value) => setFrequencyType(value as 'daily' | 'weekly' | 'custom')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="custom">Custom days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {frequencyType === 'weekly' && (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Times per week</label>
                    <Select
                      value={weeklyTimes.toString()}
                      onValueChange={(value) => setWeeklyTimes(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7].map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'time' : 'times'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {frequencyType === 'custom' && (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Select days</label>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map(day => {
                        const isSelected = selectedDays.includes(day.value);
                        return (
                          <Button
                            key={day.value}
                            type="button"
                            size="sm"
                            variant={isSelected ? "default" : "outline"}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedDays(prev => prev.filter(d => d !== day.value));
                              } else {
                                setSelectedDays(prev => [...prev, day.value]);
                              }
                            }}
                          >
                            {day.label.substring(0, 3)}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex items-center">
                  <span className="text-sm font-medium">Habit Building Elements</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <Info className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="text-sm">
                      <p>According to habit formation research, identifying a specific cue and reward
                      helps make habits stick by creating a clear habit loop.</p>
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Cue (optional)</label>
                  <Input 
                    placeholder="What will trigger this habit? (e.g. After brushing teeth)" 
                    value={habitCue}
                    onChange={(e) => setHabitCue(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Reward (optional)</label>
                  <Input 
                    placeholder="How will you reward yourself? (e.g. 5 minutes of social media)" 
                    value={habitReward}
                    onChange={(e) => setHabitReward(e.target.value)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={resetForm}>Reset</Button>
                <Button onClick={addHabit}>Create Habit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Progress Overview */}
      {habits.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div>
                <h3 className="text-lg font-medium mb-1">Today's Progress</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {Math.round(completionRate)}% of habits completed today
                </p>
                <Progress value={completionRate} className="h-2 w-full md:w-60" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{habits.length}</div>
                  <div className="text-sm text-muted-foreground">Total Habits</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {habits.filter(h => checkIfCompletedToday(h)).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed Today</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {Math.max(...habits.map(h => h.streak), 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Longest Streak</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Habits List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Your Habits</CardTitle>
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="w-auto"
            >
              <TabsList>
                <TabsTrigger value="active">All</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {filteredHabits.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No habits yet</h3>
              <p className="text-muted-foreground mb-4">
                Start building better routines by adding your first habit
              </p>
              <div className="flex justify-center gap-3">
                <Button onClick={() => setNewHabitDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Habit
                </Button>
                <Button variant="outline" onClick={() => setSuggestionsDialog(true)}>
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Browse Suggestions
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredHabits.map(habit => {
                const isCompletedToday = checkIfCompletedToday(habit);
                
                return (
                  <div key={habit.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleHabit(habit)}
                          className="mt-1"
                        >
                          {isCompletedToday ? (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{habit.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {habit.category}
                            </Badge>
                          </div>
                          
                          {habit.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {habit.description}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                            <div className="flex items-center gap-1 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {habit.frequency.type === 'daily' && 'Daily'}
                                {habit.frequency.type === 'weekly' && 
                                  `${habit.frequency.times} time${habit.frequency.times !== 1 ? 's' : ''} per week`
                                }
                                {habit.frequency.type === 'custom' && 'Custom days'}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-1 text-sm">
                              <Flame className="h-4 w-4 text-primary" />
                              <span className="font-medium">
                                {habit.streak} day{habit.streak !== 1 ? 's' : ''} streak
                              </span>
                            </div>
                            
                            {habit.cue && (
                              <div className="flex items-center gap-1 text-xs">
                                <span className="font-medium">Cue:</span>
                                <span>{habit.cue}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Calendar view */}
                          <div className="flex gap-1 mt-3">
                            {lastSevenDays.map((day, index) => {
                              const isCompleted = habit.completedDates.includes(day.dateString);
                              return (
                                <div key={index} className="flex flex-col items-center">
                                  <span className="text-xs text-muted-foreground">
                                    {day.dayName.charAt(0)}
                                  </span>
                                  <div 
                                    className={`h-6 w-6 flex items-center justify-center rounded-full ${
                                      isCompleted ? "bg-primary text-primary-foreground" : "bg-muted"
                                    }`}
                                  >
                                    {isCompleted && <CheckCheck className="h-3 w-3" />}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-50 hover:opacity-100"
                        onClick={() => deleteHabit(habit.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
