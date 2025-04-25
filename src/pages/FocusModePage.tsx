
import React, { useState, useEffect, useRef } from "react";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Check, Clock, Focus, List, Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface FocusTask {
  id: string;
  name: string;
  completed: boolean;
}

export default function FocusModePage() {
  // Timer states
  const [mode, setMode] = useState<"pomodoro" | "short" | "long">("pomodoro");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Default: 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(100);
  
  // Settings states
  const [pomodoroTime, setPomodoroTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);
  const [autoStartPomodoros, setAutoStartPomodoros] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState([50]);
  
  // Task states
  const [tasks, setTasks] = useState<FocusTask[]>([
    { id: "1", name: "Complete project proposal", completed: false },
    { id: "2", name: "Research new technologies", completed: false },
    { id: "3", name: "Review team's progress", completed: false },
  ]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [newTaskName, setNewTaskName] = useState("");
  
  // Stats
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [focusTime, setFocusTime] = useState(0);
  
  // Audio refs
  const alarmSound = useRef<HTMLAudioElement | null>(null);
  const tickSound = useRef<HTMLAudioElement | null>(null);
  
  // Initialize timer based on selected mode
  useEffect(() => {
    let time = 0;
    
    switch (mode) {
      case "pomodoro":
        time = pomodoroTime * 60;
        break;
      case "short":
        time = shortBreakTime * 60;
        break;
      case "long":
        time = longBreakTime * 60;
        break;
    }
    
    setTimeLeft(time);
    setProgress(100);
    setIsActive(false);
  }, [mode, pomodoroTime, shortBreakTime, longBreakTime]);
  
  // Timer logic
  useEffect(() => {
    let interval: any = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => {
          const newTimeLeft = timeLeft - 1;
          
          // Calculate progress percentage
          let totalTime;
          switch (mode) {
            case "pomodoro":
              totalTime = pomodoroTime * 60;
              break;
            case "short":
              totalTime = shortBreakTime * 60;
              break;
            case "long":
              totalTime = longBreakTime * 60;
              break;
            default:
              totalTime = pomodoroTime * 60;
          }
          
          setProgress((newTimeLeft / totalTime) * 100);
          
          // Play tick sound if enabled
          if (soundEnabled && tickSound.current) {
            tickSound.current.volume = volume[0] / 100;
            // Only play tick sound every second if more than 10 seconds remain
            if (newTimeLeft % 10 === 0 && newTimeLeft > 10) {
              tickSound.current.play().catch(err => console.error("Error playing tick sound:", err));
            }
          }
          
          return newTimeLeft;
        });
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer completed
      if (soundEnabled && alarmSound.current) {
        alarmSound.current.volume = volume[0] / 100;
        alarmSound.current.play().catch(err => console.error("Error playing alarm sound:", err));
      }
      
      // Update stats if pomodoro is completed
      if (mode === "pomodoro") {
        setCompletedPomodoros(prev => prev + 1);
        setFocusTime(prev => prev + pomodoroTime);
        toast.success("Pomodoro completed! Take a break.");
      } else {
        toast.success(mode === "short" ? "Short break completed!" : "Long break completed!");
      }
      
      // Auto-start next session if enabled
      const isBreak = mode !== "pomodoro";
      if ((isBreak && autoStartPomodoros) || (!isBreak && autoStartBreaks)) {
        const nextMode = isBreak ? "pomodoro" : (completedPomodoros % 4 === 0 ? "long" : "short");
        setMode(nextMode);
      } else {
        setIsActive(false);
      }
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, soundEnabled, pomodoroTime, shortBreakTime, longBreakTime, autoStartBreaks, autoStartPomodoros, completedPomodoros, volume]);
  
  // Format time to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Toggle timer state
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  // Reset timer
  const resetTimer = () => {
    let time = 0;
    switch (mode) {
      case "pomodoro":
        time = pomodoroTime * 60;
        break;
      case "short":
        time = shortBreakTime * 60;
        break;
      case "long":
        time = longBreakTime * 60;
        break;
    }
    
    setTimeLeft(time);
    setProgress(100);
    setIsActive(false);
  };
  
  // Add new task
  const addTask = () => {
    if (newTaskName.trim() === "") return;
    
    const newTask: FocusTask = {
      id: `task-${Date.now()}`,
      name: newTaskName,
      completed: false,
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskName("");
    toast.success("New task added");
  };
  
  // Toggle task completion
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };
  
  // Select task for focus
  const handleTaskSelection = (taskId: string) => {
    setSelectedTask(taskId === selectedTask ? null : taskId);
  };
  
  // Calculate time spent focused today (mock data for now)
  const todaysFocusTime = focusTime + 75; // 75 minutes from previous sessions
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <BackButton />
      <h1 className="text-3xl font-bold mb-6">Focus Mode</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Timer Column */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Focus Timer</CardTitle>
                <Badge variant={mode === "pomodoro" ? "default" : "outline"}>
                  {mode === "pomodoro" ? "Focus Session" : mode === "short" ? "Short Break" : "Long Break"}
                </Badge>
              </div>
              <CardDescription>
                {selectedTask 
                  ? `Working on: ${tasks.find(t => t.id === selectedTask)?.name}` 
                  : "Select a task to focus on"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex flex-col items-center justify-center space-y-8 pb-0">
              {/* Timer Controls */}
              <TabsList>
                <TabsTrigger 
                  value="pomodoro" 
                  onClick={() => setMode("pomodoro")}
                  className={mode === "pomodoro" ? "bg-primary text-primary-foreground" : ""}
                >
                  Pomodoro
                </TabsTrigger>
                <TabsTrigger 
                  value="shortBreak" 
                  onClick={() => setMode("short")}
                  className={mode === "short" ? "bg-primary text-primary-foreground" : ""}
                >
                  Short Break
                </TabsTrigger>
                <TabsTrigger 
                  value="longBreak" 
                  onClick={() => setMode("long")}
                  className={mode === "long" ? "bg-primary text-primary-foreground" : ""}
                >
                  Long Break
                </TabsTrigger>
              </TabsList>
              
              {/* Timer Display */}
              <div className="w-64 h-64 rounded-full border-8 border-primary/20 flex items-center justify-center relative">
                <div className="text-5xl font-bold">{formatTime(timeLeft)}</div>
                <div className="absolute inset-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (283 * progress) / 100}
                      className="text-primary"
                    />
                  </svg>
                </div>
              </div>
              
              {/* Control Buttons */}
              <div className="flex gap-4">
                <Button size="lg" variant="outline" onClick={resetTimer}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button size="lg" onClick={toggleTimer}>
                  {isActive ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Start
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between pt-6">
              <div className="flex flex-col items-center">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="text-xl font-bold">{completedPomodoros}</span>
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-sm text-muted-foreground">Today</span>
                <span className="text-xl font-bold">{todaysFocusTime} min</span>
              </div>
              
              <Button variant="ghost" size="sm" onClick={() => setSoundEnabled(!soundEnabled)}>
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Task List and Settings */}
        <div>
          <Tabs defaultValue="tasks">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tasks">
              <Card>
                <CardHeader>
                  <CardTitle>Focus Tasks</CardTitle>
                  <CardDescription>Select a task to focus on</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a new task"
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addTask();
                      }}
                    />
                    <Button onClick={addTask}>Add</Button>
                  </div>
                  
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {tasks.length > 0 ? (
                      tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`flex items-center p-3 rounded-lg border cursor-pointer ${
                            selectedTask === task.id
                              ? "bg-primary/10 border-primary"
                              : "hover:bg-accent"
                          } ${task.completed ? "opacity-50" : ""}`}
                          onClick={() => handleTaskSelection(task.id)}
                        >
                          <div className="flex-1 flex items-center">
                            <button
                              className="mr-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTaskCompletion(task.id);
                              }}
                            >
                              {task.completed ? (
                                <Check className="h-5 w-5 text-primary" />
                              ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                              )}
                            </button>
                            <span className={task.completed ? "line-through" : ""}>
                              {task.name}
                            </span>
                          </div>
                          {selectedTask === task.id && (
                            <Badge variant="secondary">Selected</Badge>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No tasks added yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Timer Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pomodoro-time">Pomodoro Length (minutes)</Label>
                    <Input
                      id="pomodoro-time"
                      type="number"
                      min="1"
                      max="60"
                      value={pomodoroTime}
                      onChange={(e) => setPomodoroTime(parseInt(e.target.value) || 25)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="short-break">Short Break Length (minutes)</Label>
                    <Input
                      id="short-break"
                      type="number"
                      min="1"
                      max="30"
                      value={shortBreakTime}
                      onChange={(e) => setShortBreakTime(parseInt(e.target.value) || 5)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="long-break">Long Break Length (minutes)</Label>
                    <Input
                      id="long-break"
                      type="number"
                      min="1"
                      max="60"
                      value={longBreakTime}
                      onChange={(e) => setLongBreakTime(parseInt(e.target.value) || 15)}
                    />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-break">Auto-start Breaks</Label>
                    <Switch
                      id="auto-break"
                      checked={autoStartBreaks}
                      onCheckedChange={setAutoStartBreaks}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-pomodoro">Auto-start Pomodoros</Label>
                    <Switch
                      id="auto-pomodoro"
                      checked={autoStartPomodoros}
                      onCheckedChange={setAutoStartPomodoros}
                    />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sound-toggle">Sound</Label>
                      <Switch
                        id="sound-toggle"
                        checked={soundEnabled}
                        onCheckedChange={setSoundEnabled}
                      />
                    </div>
                    
                    {soundEnabled && (
                      <div className="pt-2">
                        <Label htmlFor="volume-slider" className="mb-2 block">
                          Volume
                        </Label>
                        <Slider
                          id="volume-slider"
                          defaultValue={volume}
                          max={100}
                          step={1}
                          onValueChange={setVolume}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => {
                      // Reset to defaults
                      setPomodoroTime(25);
                      setShortBreakTime(5);
                      setLongBreakTime(15);
                      setAutoStartBreaks(false);
                      setAutoStartPomodoros(false);
                      setSoundEnabled(true);
                      setVolume([50]);
                      toast.success("Settings reset to defaults");
                    }}
                    variant="outline" 
                    className="w-full"
                  >
                    Reset to Default
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Hidden audio elements */}
      <audio ref={alarmSound} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" />
      <audio ref={tickSound} src="https://assets.mixkit.co/active_storage/sfx/2729/2729-preview.mp3" />
    </div>
  );
}
