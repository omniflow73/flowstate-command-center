
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function QuickAdd() {
  const handleQuickAdd = (type: string) => {
    toast.info(`Creating new ${type}...`);
    // Here you would typically open a modal or navigate to the creation form
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-2 bg-gradient-primary hover:opacity-90">
          <Plus size={16} />
          <span>Quick Add</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          onClick={() => handleQuickAdd("task")}
          className="cursor-pointer"
        >
          New Task
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleQuickAdd("event")}
          className="cursor-pointer"
        >
          New Event
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleQuickAdd("note")}
          className="cursor-pointer"
        >
          New Note
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleQuickAdd("project")}
          className="cursor-pointer"
        >
          New Project
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleQuickAdd("habit")}
          className="cursor-pointer"
        >
          New Habit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
