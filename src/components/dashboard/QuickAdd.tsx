
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useState } from "react";

export default function QuickAdd() {
  const [isOpen, setIsOpen] = useState(false);

  const handleQuickAdd = (type: string) => {
    toast.success(`Creating new ${type}...`);
    setIsOpen(false);
    // In a real implementation, this would open a modal or form
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
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
