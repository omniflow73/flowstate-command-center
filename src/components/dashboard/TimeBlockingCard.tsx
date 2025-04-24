
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Edit, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type TimeBlock = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: string;
  day: string;
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const categories = [
  { value: "work", label: "Work", color: "bg-blue-500" },
  { value: "personal", label: "Personal", color: "bg-green-500" },
  { value: "study", label: "Study", color: "bg-purple-500" },
  { value: "health", label: "Health", color: "bg-red-500" },
  { value: "rest", label: "Rest", color: "bg-orange-500" },
];

export default function TimeBlockingCard() {
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null);
  
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([
    { id: "1", title: "Deep Work", startTime: "09:00", endTime: "11:00", category: "work", day: "Monday" },
    { id: "2", title: "Meetings", startTime: "11:00", endTime: "12:00", category: "work", day: "Monday" },
    { id: "3", title: "Lunch Break", startTime: "12:00", endTime: "13:00", category: "rest", day: "Monday" },
    { id: "4", title: "Project Planning", startTime: "13:00", endTime: "15:00", category: "work", day: "Monday" },
    { id: "5", title: "Exercise", startTime: "17:00", endTime: "18:00", category: "health", day: "Monday" },
    { id: "6", title: "Team Meeting", startTime: "10:00", endTime: "11:00", category: "work", day: "Tuesday" },
    { id: "7", title: "Study Session", startTime: "13:00", endTime: "15:00", category: "study", day: "Tuesday" },
  ]);

  const [newBlock, setNewBlock] = useState<Omit<TimeBlock, "id">>({
    title: "",
    startTime: "09:00",
    endTime: "10:00",
    category: "work",
    day: selectedDay,
  });

  const getFilteredBlocks = () => {
    return timeBlocks.filter(block => block.day === selectedDay).sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
  };

  const handleAddBlock = () => {
    // Validate inputs
    if (!newBlock.title.trim()) {
      toast.error("Please enter a title for your time block");
      return;
    }

    // Validate time range
    const startTime = new Date(`2000-01-01T${newBlock.startTime}`);
    const endTime = new Date(`2000-01-01T${newBlock.endTime}`);
    
    if (startTime >= endTime) {
      toast.error("End time must be after start time");
      return;
    }

    // Check for overlapping blocks
    const dayBlocks = timeBlocks.filter(block => block.day === selectedDay);
    const hasOverlap = dayBlocks.some(block => {
      const blockStart = new Date(`2000-01-01T${block.startTime}`);
      const blockEnd = new Date(`2000-01-01T${block.endTime}`);
      
      return (
        (startTime >= blockStart && startTime < blockEnd) || 
        (endTime > blockStart && endTime <= blockEnd) ||
        (startTime <= blockStart && endTime >= blockEnd)
      );
    });

    if (hasOverlap && !editingBlock) {
      toast.error("This time block overlaps with an existing block");
      return;
    }

    if (editingBlock) {
      // Update existing block
      setTimeBlocks(blocks => 
        blocks.map(block => 
          block.id === editingBlock.id 
            ? { ...newBlock, id: block.id } 
            : block
        )
      );
      toast.success("Time block updated");
    } else {
      // Add new block
      const id = Date.now().toString();
      setTimeBlocks([...timeBlocks, { id, ...newBlock }]);
      toast.success("Time block added");
    }

    // Reset form
    setNewBlock({
      title: "",
      startTime: "09:00",
      endTime: "10:00",
      category: "work",
      day: selectedDay,
    });
    setIsAddingBlock(false);
    setEditingBlock(null);
  };

  const handleEditBlock = (block: TimeBlock) => {
    setEditingBlock(block);
    setNewBlock({
      title: block.title,
      startTime: block.startTime,
      endTime: block.endTime,
      category: block.category,
      day: block.day,
    });
    setIsAddingBlock(true);
  };

  const handleDeleteBlock = (id: string) => {
    setTimeBlocks(blocks => blocks.filter(block => block.id !== id));
    toast.success("Time block deleted");
  };

  const getCategoryColor = (categoryValue: string) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.color : "bg-gray-500";
  };

  const filteredBlocks = getFilteredBlocks();

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Time Blocking</CardTitle>
          <Dialog open={isAddingBlock} onOpenChange={setIsAddingBlock}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Plus size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingBlock ? "Edit Time Block" : "Add New Time Block"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newBlock.title}
                    onChange={(e) => setNewBlock({ ...newBlock, title: e.target.value })}
                    placeholder="What will you do during this time?"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newBlock.startTime}
                      onChange={(e) => setNewBlock({ ...newBlock, startTime: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newBlock.endTime}
                      onChange={(e) => setNewBlock({ ...newBlock, endTime: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newBlock.category}
                    onValueChange={(value) => setNewBlock({ ...newBlock, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                            {category.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="day">Day</Label>
                  <Select
                    value={newBlock.day}
                    onValueChange={(value) => setNewBlock({ ...newBlock, day: value })}
                  >
                    <SelectTrigger id="day">
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsAddingBlock(false);
                  setEditingBlock(null);
                }}>
                  Cancel
                </Button>
                <Button onClick={handleAddBlock}>
                  {editingBlock ? "Update Block" : "Add Block"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {days.map((day) => (
            <Button
              key={day}
              variant={day === selectedDay ? "default" : "outline"}
              size="sm"
              className={cn("text-xs", day === selectedDay ? "" : "border-dashed")}
              onClick={() => setSelectedDay(day)}
            >
              {day.substring(0, 3)}
            </Button>
          ))}
        </div>
        
        <div className="space-y-2 max-h-[240px] overflow-auto pr-2">
          {filteredBlocks.length > 0 ? (
            filteredBlocks.map((block) => (
              <div 
                key={block.id}
                className="p-3 border rounded-md flex items-center gap-3"
              >
                <div className={`w-3 h-full min-h-[2rem] rounded ${getCategoryColor(block.category)}`}></div>
                <div className="flex-1">
                  <h4 className="font-medium">{block.title}</h4>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {block.startTime} - {block.endTime}
                  </div>
                </div>
                <div className="flex items-center">
                  <Button variant="ghost" size="sm" onClick={() => handleEditBlock(block)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteBlock(block.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-6 w-6 mx-auto mb-2 opacity-50" />
              <p>No time blocks for {selectedDay}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => {
                  setNewBlock({...newBlock, day: selectedDay});
                  setIsAddingBlock(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Time Block
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
