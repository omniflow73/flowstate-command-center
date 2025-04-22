
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Flag, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Task = {
  id: number;
  title: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  dueTime?: string;
};

export default function TasksPage() {
  const navigate = useNavigate();
  const [newTask, setNewTask] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<"high" | "medium" | "low">("medium");
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Complete project proposal", completed: false, priority: "high", dueTime: "14:00" },
    { id: 2, title: "Review client feedback", completed: false, priority: "medium" },
    { id: 3, title: "Weekly team meeting", completed: true, priority: "high", dueTime: "15:30" },
    { id: 4, title: "Update documentation", completed: false, priority: "low" },
  ]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
      setTasks([...tasks, {
        id: newId,
        title: newTask,
        completed: false,
        priority: selectedPriority
      }]);
      setNewTask("");
      toast.success("Task added successfully!");
    } else {
      toast.error("Please enter a task");
    }
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks(prevTasks => {
      return prevTasks.map(task => {
        if (task.id === id) {
          const updatedTask = { ...task, completed: !task.completed };
          toast.success(updatedTask.completed ? `Task completed: ${task.title}` : `Task marked as incomplete: ${task.title}`);
          return updatedTask;
        }
        return task;
      });
    });
  };

  const deleteTask = (id: number) => {
    const taskToDelete = tasks.find(task => task.id === id);
    if (taskToDelete) {
      setTasks(tasks.filter(task => task.id !== id));
      toast.success(`Task deleted: ${taskToDelete.title}`);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500 dark:text-red-400";
      case "medium": return "text-orange-500 dark:text-orange-400";
      case "low": return "text-blue-500 dark:text-blue-400";
      default: return "";
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8 min-h-screen">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <p className="text-muted-foreground">
          Manage your tasks and stay organized.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <Input 
              placeholder="Enter new task..." 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <div className="flex space-x-2">
              <Select
                value={selectedPriority}
                onValueChange={(value) => setSelectedPriority(value as "high" | "medium" | "low")}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddTask} className="ml-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No tasks yet. Add your first task above!</p>
            ) : (
              tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`flex items-center justify-between gap-2 p-3 rounded-lg border ${task.completed ? "border-muted bg-muted/50" : "border-transparent hover:bg-muted/10"}`}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={task.completed} 
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                    />
                    <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {task.dueTime && (
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        <span>{task.dueTime}</span>
                      </div>
                    )}
                    <Flag size={14} className={getPriorityColor(task.priority)} />
                    <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
