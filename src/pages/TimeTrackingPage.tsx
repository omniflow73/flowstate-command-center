import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Play, Pause, Plus, Trash2, BarChart2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter, DialogTrigger 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BackButton } from "@/components/ui/back-button";

type TimeEntry = {
  id: string;
  task: string;
  category: string;
  startTime: number;
  endTime: number | null;
  duration: number;
  isRunning: boolean;
};

const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const categories = [
  "Work", "Study", "Personal", "Exercise", "Meeting", "Project"
];

export default function TimeTrackingPage() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(() => {
    const saved = localStorage.getItem('timeEntries');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [newTaskDialog, setNewTaskDialog] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Work");
  const [timer, setTimer] = useState(0);
  const [currentView, setCurrentView] = useState<'today' | 'week' | 'all'>('today');
  
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('timeEntries', JSON.stringify(timeEntries));
  }, [timeEntries]);

  useEffect(() => {
    let interval: number | undefined;
    
    if (activeEntryId) {
      const activeEntry = timeEntries.find(entry => entry.id === activeEntryId);
      if (activeEntry && activeEntry.isRunning) {
        const startTime = activeEntry.startTime;
        
        interval = window.setInterval(() => {
          const now = Date.now();
          const elapsed = now - startTime + activeEntry.duration;
          setTimer(elapsed);
        }, 1000);
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeEntryId, timeEntries]);

  const startNewTimer = () => {
    if (!newTaskName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task name",
        variant: "destructive",
      });
      return;
    }

    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      task: newTaskName,
      category: selectedCategory,
      startTime: Date.now(),
      endTime: null,
      duration: 0,
      isRunning: true,
    };

    if (activeEntryId) {
      pauseTimer(activeEntryId);
    }

    setTimeEntries(prev => [...prev, newEntry]);
    setActiveEntryId(newEntry.id);
    setNewTaskName("");
    setSelectedCategory("Work");
    setNewTaskDialog(false);
    toast({
      title: "Timer Started",
      description: `Tracking time for "${newTaskName}"`,
    });
  };

  const resumeTimer = (id: string) => {
    if (activeEntryId) {
      pauseTimer(activeEntryId);
    }

    setTimeEntries(prev => 
      prev.map(entry => {
        if (entry.id === id) {
          return {
            ...entry,
            startTime: Date.now(),
            isRunning: true,
          };
        }
        return entry;
      })
    );
    
    setActiveEntryId(id);
    toast({
      title: "Timer Resumed",
      description: `Resumed tracking for "${timeEntries.find(e => e.id === id)?.task}"`,
    });
  };

  const pauseTimer = (id: string) => {
    setTimeEntries(prev => 
      prev.map(entry => {
        if (entry.id === id && entry.isRunning) {
          const now = Date.now();
          const newDuration = entry.duration + (now - entry.startTime);
          return {
            ...entry,
            duration: newDuration,
            isRunning: false,
          };
        }
        return entry;
      })
    );
    
    if (activeEntryId === id) {
      setActiveEntryId(null);
    }
    
    toast({
      title: "Timer Paused",
      description: `Paused tracking for "${timeEntries.find(e => e.id === id)?.task}"`,
    });
  };

  const deleteEntry = (id: string) => {
    if (activeEntryId === id) {
      setActiveEntryId(null);
    }
    
    setTimeEntries(prev => prev.filter(entry => entry.id !== id));
    toast({
      title: "Entry Deleted",
      description: "Time entry has been removed",
    });
  };

  const filterEntriesByView = (): TimeEntry[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekAgo = today - 7 * 24 * 60 * 60 * 1000;
    
    switch(currentView) {
      case 'today':
        return timeEntries.filter(entry => {
          const entryDate = entry.startTime;
          return entryDate >= today;
        });
      case 'week':
        return timeEntries.filter(entry => {
          const entryDate = entry.startTime;
          return entryDate >= weekAgo;
        });
      case 'all':
      default:
        return timeEntries;
    }
  };

  const calculateTotalTime = (): number => {
    return filterEntriesByView().reduce((total, entry) => {
      let entryDuration = entry.duration;
      if (entry.isRunning) {
        entryDuration += Date.now() - entry.startTime;
      }
      return total + entryDuration;
    }, 0);
  };

  const getCategoryStats = () => {
    const filtered = filterEntriesByView();
    const stats: Record<string, number> = {};
    let totalTime = 0;
    
    filtered.forEach(entry => {
      let duration = entry.duration;
      if (entry.isRunning) {
        duration += Date.now() - entry.startTime;
      }
      
      stats[entry.category] = (stats[entry.category] || 0) + duration;
      totalTime += duration;
    });
    
    return Object.entries(stats).map(([category, time]) => ({
      category,
      time,
      percentage: totalTime > 0 ? (time / totalTime) * 100 : 0
    }));
  };

  const filteredEntries = filterEntriesByView();
  const totalTrackedTime = calculateTotalTime();
  const categoryStats = getCategoryStats();

  return (
    <div className="container px-4 py-8 max-w-6xl mx-auto">
      <BackButton />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Time Tracking</h1>
        <Dialog open={newTaskDialog} onOpenChange={setNewTaskDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Timer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start New Timer</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Task Name</label>
                <Input
                  placeholder="What are you working on?"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={startNewTimer}>Start Timer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {activeEntryId && (
        <Card className="mb-6 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">
                  {timeEntries.find(e => e.id === activeEntryId)?.task}
                </h3>
                <Badge variant="outline" className="mt-1">
                  {timeEntries.find(e => e.id === activeEntryId)?.category}
                </Badge>
              </div>
              <div className="flex items-center">
                <div className="text-2xl font-mono mr-4">{formatTime(timer)}</div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => pauseTimer(activeEntryId)}
                >
                  <Pause className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="entries" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="entries">Time Entries</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="entries" className="mt-4">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Recent Entries</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentView('today')}
                    className={currentView === 'today' ? 'bg-primary text-primary-foreground' : ''}
                  >
                    Today
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentView('week')}
                    className={currentView === 'week' ? 'bg-primary text-primary-foreground' : ''}
                  >
                    Week
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentView('all')}
                    className={currentView === 'all' ? 'bg-primary text-primary-foreground' : ''}
                  >
                    All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEntries.length === 0 ? (
                  <p className="text-center py-6 text-muted-foreground">
                    No time entries for the selected period.
                  </p>
                ) : (
                  filteredEntries.map(entry => (
                    <div 
                      key={entry.id}
                      className="flex items-center justify-between border-b pb-3 last:border-0"
                    >
                      <div>
                        <h3 className="font-medium">{entry.task}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{entry.category}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(entry.startTime).toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-mono">
                          {formatTime(entry.isRunning 
                            ? entry.duration + (Date.now() - entry.startTime)
                            : entry.duration
                          )}
                        </div>
                        {entry.isRunning ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => pauseTimer(entry.id)}
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => resumeTimer(entry.id)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteEntry(entry.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-4">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Time Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Total Time: {formatTime(totalTrackedTime)}</h3>
              </div>
              
              {categoryStats.length === 0 ? (
                <p className="text-center py-6 text-muted-foreground">
                  No data available for the selected period.
                </p>
              ) : (
                <div className="space-y-4">
                  {categoryStats.map(({category, time, percentage}) => (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{category}</span>
                        <span className="font-medium">{formatTime(time)} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
