
import React, { useState, useEffect, useRef } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  Focus, Timer, Play, Pause, RotateCcw, 
  Volume2, Volume, VolumeX, Check, Plus, 
  List, CheckCheck, Settings, X, Clock,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogFooter, DialogTrigger, DialogClose 
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

// Sound options for focus mode
const soundOptions = [
  { id: "none", name: "None", url: "" },
  { id: "rain", name: "Rain", url: "https://freesound.org/data/previews/346/346170_3905081-lq.mp3" },
  { id: "forest", name: "Forest", url: "https://freesound.org/data/previews/501/501999_7541975-lq.mp3" },
  { id: "cafe", name: "Café", url: "https://freesound.org/data/previews/323/323681_5049874-lq.mp3" },
  { id: "waves", name: "Waves", url: "https://freesound.org/data/previews/436/436107_6142149-lq.mp3" },
  { id: "whitenoise", name: "White Noise", url: "https://freesound.org/data/previews/133/133099_2398403-lq.mp3" },
];

type TimerMode = 'pomodoro' | 'short-break' | 'long-break';

interface FocusSession {
  id: string;
  date: string;
  duration: number;
  task?: string;
  notes?: string;
  completed: boolean;
}

interface FocusTask {
  id: string;
  task: string;
  isCompleted: boolean;
}

export default function FocusModePage() {
  // Timer state
  const [timerMode, setTimerMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Default 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);
  
  // Settings state
  const [pomodoroTime, setPomodoroTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);
  const [autoStartPomodoros, setAutoStartPomodoros] = useState(false);
  const [longBreakInterval, setLongBreakInterval] = useState(4);
  
  // Sound state
  const [selectedSound, setSelectedSound] = useState("none");
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Focus tasks state
  const [focusTasks, setFocusTasks] = useState<FocusTask[]>(() => {
    const saved = localStorage.getItem('focusTasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [currentTask, setCurrentTask] = useState<FocusTask | null>(null);
  
  // Session history state
  const [sessions, setSessions] = useState<FocusSession[]>(() => {
    const saved = localStorage.getItem('focusSessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [sessionNotes, setSessionNotes] = useState("");
  
  // UI state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tasksView, setTasksView] = useState<'active' | 'completed'>('active');
  
  const { toast } = useToast();
  
  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('focusTasks', JSON.stringify(focusTasks));
  }, [focusTasks]);
  
  useEffect(() => {
    localStorage.setItem('focusSessions', JSON.stringify(sessions));
  }, [sessions]);

  // Initialize timer based on mode
  useEffect(() => {
    if (timerMode === 'pomodoro') {
      setTimeLeft(pomodoroTime * 60);
    } else if (timerMode === 'short-break') {
      setTimeLeft(shortBreakTime * 60);
    } else if (timerMode === 'long-break') {
      setTimeLeft(longBreakTime * 60);
    }
  }, [timerMode, pomodoroTime, shortBreakTime, longBreakTime]);

  // Timer logic
  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive) {
      interval = window.setInterval(() => {
        setTimeLeft((timeLeft) => {
          if (timeLeft <= 1) {
            clearInterval(interval);
            timerComplete();
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);
  
  // Audio setup
  useEffect(() => {
    if (selectedSound !== "none") {
      const soundOption = soundOptions.find(option => option.id === selectedSound);
      if (soundOption && audioRef.current) {
        audioRef.current.src = soundOption.url;
        audioRef.current.loop = true;
        
        if (isActive && !isMuted) {
          audioRef.current.volume = volume / 100;
          audioRef.current.play().catch(error => {
            console.error("Audio playback failed:", error);
          });
        }
      }
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [selectedSound, isActive, isMuted]);
  
  // Volume change handler
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      if (isMuted) {
        audioRef.current.pause();
      } else if (isActive && selectedSound !== "none") {
        audioRef.current.play().catch(error => {
          console.error("Audio playback failed:", error);
        });
      }
    }
  }, [volume, isMuted]);

  const startTimer = () => {
    if (!sessionActive && !currentTask) {
      toast({
        title: "No task selected",
        description: "Please select a task to focus on",
        variant: "destructive",
      });
      return;
    }
    
    if (!sessionActive) {
      const now = new Date();
      const newSession: FocusSession = {
        id: now.getTime().toString(),
        date: now.toISOString(),
        duration: 0,
        task: currentTask ? currentTask.task : undefined,
        completed: false
      };
      setSessions(prev => [...prev, newSession]);
      setSessionActive(true);
    }
    
    setIsActive(true);
    toast({
      title: "Focus Timer Started",
      description: timerMode === 'pomodoro' 
        ? "Time to focus!" 
        : "Taking a break",
    });
  };
  
  const pauseTimer = () => {
    setIsActive(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    toast({
      title: "Timer Paused",
      description: "Timer paused. Resume when you're ready.",
    });
  };
  
  const resetTimer = () => {
    setIsActive(false);
    
    if (timerMode === 'pomodoro') {
      setTimeLeft(pomodoroTime * 60);
    } else if (timerMode === 'short-break') {
      setTimeLeft(shortBreakTime * 60);
    } else {
      setTimeLeft(longBreakTime * 60);
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    toast({
      title: "Timer Reset",
      description: "Timer has been reset.",
    });
  };
  
  const timerComplete = () => {
    const newCycles = timerMode === 'pomodoro' ? cycles + 1 : cycles;
    setCycles(newCycles);
    
    // Play notification sound
    const notification = new Audio("https://freesound.org/data/previews/521/521275_7399698-lq.mp3");
    notification.play();
    
    // Update session if it was a pomodoro
    if (timerMode === 'pomodoro') {
      setSessions(prev => prev.map((session, index) => {
        if (index === prev.length - 1) {
          return {
            ...session,
            duration: session.duration + (pomodoroTime * 60),
            notes: sessionNotes,
            completed: true
          };
        }
        return session;
      }));
      
      // Mark task as completed if we completed the pomodoro
      if (currentTask) {
        setFocusTasks(prev => prev.map(task => 
          task.id === currentTask.id ? { ...task, isCompleted: true } : task
        ));
        
        toast({
          title: "Task Completed!",
          description: `Great job completing "${currentTask.task}"`,
        });
        
        setCurrentTask(null);
      }
    }
    
    toast({
      title: timerMode === 'pomodoro' ? "Pomodoro Completed!" : "Break Completed!",
      description: timerMode === 'pomodoro' 
        ? "Time for a break!" 
        : "Ready for another focused session?",
    });
    
    // Determine next timer mode
    let nextMode: TimerMode;
    if (timerMode === 'pomodoro') {
      nextMode = newCycles % longBreakInterval === 0 ? 'long-break' : 'short-break';
      
      if (autoStartBreaks) {
        setTimerMode(nextMode);
        setIsActive(true);
      } else {
        setTimerMode(nextMode);
        setIsActive(false);
      }
      
    } else {
      // Coming from a break
      if (autoStartPomodoros) {
        setTimerMode('pomodoro');
        setIsActive(true);
      } else {
        setTimerMode('pomodoro');
        setIsActive(false);
      }
    }
    
    // If session is done (after completing pomodoro and break)
    if (timerMode !== 'pomodoro') {
      setSessionActive(false);
    }
  };
  
  const formatTimeDisplay = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const addFocusTask = () => {
    if (!newTask.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task name",
        variant: "destructive",
      });
      return;
    }
    
    const task: FocusTask = {
      id: Date.now().toString(),
      task: newTask,
      isCompleted: false
    };
    
    setFocusTasks(prev => [...prev, task]);
    setNewTask("");
    
    toast({
      title: "Task Added",
      description: `"${newTask}" added to your focus list`,
    });
  };
  
  const toggleTaskCompletion = (taskId: string) => {
    setFocusTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  };
  
  const deleteTask = (taskId: string) => {
    setFocusTasks(prev => prev.filter(task => task.id !== taskId));
    
    if (currentTask?.id === taskId) {
      setCurrentTask(null);
    }
    
    toast({
      title: "Task Deleted",
      description: "Task has been removed",
    });
  };
  
  const selectTaskForFocus = (task: FocusTask) => {
    setCurrentTask(task);
    
    toast({
      title: "Task Selected",
      description: `Ready to focus on "${task.task}"`,
    });
  };
  
  // Calculate progress percentage
  const calculateProgress = (): number => {
    let totalSeconds = 0;
    if (timerMode === 'pomodoro') {
      totalSeconds = pomodoroTime * 60;
    } else if (timerMode === 'short-break') {
      totalSeconds = shortBreakTime * 60;
    } else {
      totalSeconds = longBreakTime * 60;
    }
    
    const elapsed = totalSeconds - timeLeft;
    return (elapsed / totalSeconds) * 100;
  };
  
  const filteredTasks = focusTasks.filter(task => 
    tasksView === 'active' ? !task.isCompleted : task.isCompleted
  );
  
  // Format session duration for display
  const formatSessionDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="container px-4 py-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Focus className="h-8 w-8" />
            Focus Mode
          </h1>
          <p className="text-muted-foreground mt-1">
            Minimize distractions and maximize your productivity
          </p>
        </div>
        
        <Button
          variant="outline"
          onClick={() => setSettingsOpen(true)}
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timer Section */}
        <Card className="lg:col-span-8">
          <CardHeader className="pb-3">
            <CardTitle>Focus Timer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-6">
              <div className="flex justify-center gap-2">
                <Button
                  variant={timerMode === 'pomodoro' ? "default" : "outline"}
                  onClick={() => {
                    if (!isActive) setTimerMode('pomodoro');
                  }}
                  className="w-32"
                  disabled={isActive}
                >
                  Pomodoro
                </Button>
                <Button
                  variant={timerMode === 'short-break' ? "default" : "outline"}
                  onClick={() => {
                    if (!isActive) setTimerMode('short-break');
                  }}
                  className="w-32"
                  disabled={isActive}
                >
                  Short Break
                </Button>
                <Button
                  variant={timerMode === 'long-break' ? "default" : "outline"}
                  onClick={() => {
                    if (!isActive) setTimerMode('long-break');
                  }}
                  className="w-32"
                  disabled={isActive}
                >
                  Long Break
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center">
              {/* Current Task */}
              {currentTask && (
                <div className="mb-4 text-center">
                  <Badge variant="outline" className="text-base px-3 py-1">
                    {currentTask.task}
                  </Badge>
                </div>
              )}
              
              {/* Timer Display */}
              <div className="relative mb-6">
                <Progress 
                  value={calculateProgress()} 
                  className="h-4 w-64" 
                />
                <div className="text-6xl font-bold font-mono mt-4">
                  {formatTimeDisplay(timeLeft)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {timerMode === 'pomodoro' ? 'Focus Time' : 'Break Time'}
                </div>
              </div>
              
              {/* Cycles Display */}
              <div className="mb-6 text-center">
                <div className="text-sm text-muted-foreground">
                  Cycles Completed
                </div>
                <div className="flex items-center justify-center gap-2 mt-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-3 w-3 rounded-full",
                        i < (cycles % 4) ? "bg-primary" : "bg-muted"
                      )}
                    />
                  ))}
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="default"
                  size="lg"
                  className="h-12 w-12 rounded-full"
                  onClick={isActive ? pauseTimer : startTimer}
                >
                  {isActive ? <Pause /> : <Play />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetTimer}
                  disabled={timeLeft === (timerMode === 'pomodoro' ? pomodoroTime * 60 : 
                    timerMode === 'short-break' ? shortBreakTime * 60 : longBreakTime * 60)}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Sound controls */}
              {sessionActive && (
                <div className="flex items-center gap-4 mt-6">
                  <Select
                    value={selectedSound}
                    onValueChange={setSelectedSound}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Select sound" />
                    </SelectTrigger>
                    <SelectContent>
                      {soundOptions.map(sound => (
                        <SelectItem key={sound.id} value={sound.id}>
                          {sound.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                    disabled={selectedSound === "none"}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : volume > 50 ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <Volume className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Slider
                    className="w-28"
                    value={[volume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={value => setVolume(value[0])}
                    disabled={isMuted || selectedSound === "none"}
                  />
                  
                  <audio ref={audioRef} />
                </div>
              )}
              
              {/* Session Notes */}
              {sessionActive && timerMode === 'pomodoro' && (
                <div className="mt-6 w-full">
                  <label className="text-sm font-medium mb-2 block">
                    Session Notes
                  </label>
                  <Textarea
                    placeholder="Record your thoughts during this focus session..."
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    className="min-h-20"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Tasks Section */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Focus Tasks</CardTitle>
              <div className="flex">
                <Button
                  variant={tasksView === 'active' ? "default" : "ghost"}
                  size="sm"
                  className="h-8"
                  onClick={() => setTasksView('active')}
                >
                  Active
                </Button>
                <Button
                  variant={tasksView === 'completed' ? "default" : "ghost"}
                  size="sm"
                  className="h-8"
                  onClick={() => setTasksView('completed')}
                >
                  Completed
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* New Task Input */}
              {tasksView === 'active' && (
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add a focus task..." 
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') addFocusTask();
                    }}
                  />
                  <Button variant="outline" size="icon" onClick={addFocusTask}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {/* Tasks List */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    {tasksView === 'active' 
                      ? "No active tasks. Add a task to get started." 
                      : "No completed tasks yet."}
                  </div>
                ) : (
                  filteredTasks.map(task => (
                    <div 
                      key={task.id}
                      className={cn(
                        "flex items-center justify-between rounded-md border p-3",
                        currentTask?.id === task.id && "border-primary"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          checked={task.isCompleted}
                          onCheckedChange={() => toggleTaskCompletion(task.id)}
                          id={`task-${task.id}`}
                        />
                        <label 
                          htmlFor={`task-${task.id}`}
                          className={cn(
                            task.isCompleted && "line-through text-muted-foreground"
                          )}
                        >
                          {task.task}
                        </label>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {/* Focus on this task button (only for active tasks) */}
                        {!task.isCompleted && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => selectTaskForFocus(task)}
                          >
                            <Focus className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {/* Delete task button */}
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => deleteTask(task.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Session History */}
        <Card className="lg:col-span-12">
          <CardHeader>
            <CardTitle>Focus Session History</CardTitle>
            <CardDescription>
              Track your progress and productivity over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto opacity-50 mb-3" />
                <h3 className="text-lg font-medium">No sessions recorded yet</h3>
                <p className="mb-4">Complete your first focus session to track your progress</p>
                <Button onClick={startTimer}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Focus Session
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Total Focus Time
                      </h3>
                      <div className="text-3xl font-bold">
                        {formatSessionDuration(sessions.reduce(
                          (total, session) => total + session.duration, 0
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Sessions Completed
                      </h3>
                      <div className="text-3xl font-bold">
                        {sessions.filter(session => session.completed).length}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Longest Session
                      </h3>
                      <div className="text-3xl font-bold">
                        {formatSessionDuration(Math.max(
                          ...sessions.map(session => session.duration)
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Session List */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Recent Sessions</h3>
                  <div className="space-y-2">
                    {sessions.slice().reverse().slice(0, 5).map(session => (
                      <div 
                        key={session.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 rounded-md border p-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{new Date(session.date).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                          {session.task && (
                            <div className="text-sm text-muted-foreground mt-1">
                              Task: {session.task}
                            </div>
                          )}
                          {session.notes && (
                            <div className="text-sm text-muted-foreground mt-1 max-w-md">
                              Notes: {session.notes.length > 100 
                                ? `${session.notes.substring(0, 100)}...` 
                                : session.notes}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-lg font-medium">
                            {formatSessionDuration(session.duration)}
                          </div>
                          {session.completed ? (
                            <Badge variant="outline" className="bg-primary/10">
                              <CheckCheck className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-muted">
                              In Progress
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Focus Settings</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="timer">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="timer">Timer</TabsTrigger>
              <TabsTrigger value="auto">Automation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timer" className="mt-4">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Pomodoro Duration (minutes)
                  </label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[pomodoroTime]}
                      min={5}
                      max={60}
                      step={1}
                      onValueChange={value => setPomodoroTime(value[0])}
                      className="flex-1"
                    />
                    <span className="w-8 text-center">{pomodoroTime}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Short Break Duration (minutes)
                  </label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[shortBreakTime]}
                      min={1}
                      max={15}
                      step={1}
                      onValueChange={value => setShortBreakTime(value[0])}
                      className="flex-1"
                    />
                    <span className="w-8 text-center">{shortBreakTime}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Long Break Duration (minutes)
                  </label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[longBreakTime]}
                      min={5}
                      max={30}
                      step={1}
                      onValueChange={value => setLongBreakTime(value[0])}
                      className="flex-1"
                    />
                    <span className="w-8 text-center">{longBreakTime}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Long Break Interval (pomodoros)
                  </label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[longBreakInterval]}
                      min={2}
                      max={8}
                      step={1}
                      onValueChange={value => setLongBreakInterval(value[0])}
                      className="flex-1"
                    />
                    <span className="w-8 text-center">{longBreakInterval}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="auto" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">
                      Auto-start Breaks
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Start breaks automatically after each pomodoro
                    </p>
                  </div>
                  <Switch
                    checked={autoStartBreaks}
                    onCheckedChange={setAutoStartBreaks}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">
                      Auto-start Pomodoros
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Start pomodoros automatically after breaks
                    </p>
                  </div>
                  <Switch
                    checked={autoStartPomodoros}
                    onCheckedChange={setAutoStartPomodoros}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="default">
                Save Changes
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
