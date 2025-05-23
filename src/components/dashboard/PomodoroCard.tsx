
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PomodoroCard() {
  const [timer, setTimer] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(100);
  const [mode, setMode] = useState<"pomodoro" | "short" | "long">("pomodoro");
  const totalTime = 25 * 60; // 25 minutes in seconds

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer - 1;
          setProgress((newTimer / totalTime) * 100);
          return newTimer;
        });
      }, 1000);
    } else if (timer === 0) {
      setIsActive(false);
      toast.success("Pomodoro session completed!");
      // Play notification sound or show notification in a real app
    }

    return () => clearInterval(interval);
  }, [isActive, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
    toast.info(isActive ? "Timer paused" : "Timer started");
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimer(25 * 60);
    setProgress(100);
    toast.info("Timer reset");
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle>Pomodoro Timer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <Tabs defaultValue="pomodoro" className="w-full mb-4">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger 
                value="pomodoro" 
                onClick={() => setMode("pomodoro")}
              >
                Pomodoro
              </TabsTrigger>
              <TabsTrigger 
                value="short" 
                onClick={() => setMode("short")}
              >
                Short Break
              </TabsTrigger>
              <TabsTrigger 
                value="long" 
                onClick={() => setMode("long")}
              >
                Long Break
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="text-4xl font-bold my-4">{formatTime(timer)}</div>
          <Progress value={progress} className="w-full mb-4 h-2" />
          <div className="flex gap-2">
            <Button onClick={toggleTimer} className="w-24">
              {isActive ? <Pause size={16} className="mr-2" /> : <Play size={16} className="mr-2" />}
              {isActive ? "Pause" : "Start"}
            </Button>
            <Button variant="outline" onClick={resetTimer}>
              <RotateCcw size={16} className="mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
