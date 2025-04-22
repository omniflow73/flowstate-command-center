
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Flag } from "lucide-react";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  dueTime?: string;
};

export default function TaskCard() {
  const tasks: Task[] = [
    { id: "1", title: "Complete project proposal", completed: false, priority: "high", dueTime: "14:00" },
    { id: "2", title: "Review client feedback", completed: false, priority: "medium" },
    { id: "3", title: "Weekly team meeting", completed: true, priority: "high", dueTime: "15:30" },
    { id: "4", title: "Update documentation", completed: false, priority: "low" },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500 dark:text-red-400";
      case "medium": return "text-orange-500 dark:text-orange-400";
      case "low": return "text-blue-500 dark:text-blue-400";
      default: return "";
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle>Today's Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className={`flex items-center gap-2 p-3 rounded-lg border ${task.completed ? "border-muted bg-muted/50" : "border-transparent hover:bg-muted/10"}`}
            >
              <Checkbox checked={task.completed} />
              <span className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                {task.title}
              </span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {task.dueTime && (
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>{task.dueTime}</span>
                  </div>
                )}
                <Flag size={14} className={getPriorityColor(task.priority)} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
