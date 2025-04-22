
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function QuickAdd() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-2 bg-gradient-primary hover:opacity-90">
          <Plus size={16} />
          <span>Quick Add</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem className="cursor-pointer">New Task</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">New Event</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">New Note</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">New Project</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">New Habit</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
