
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  FileText, 
  Pen, 
  Pencil, 
  Highlighter, 
  Eraser, 
  Trash2, 
  Check,
  X
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type Tool = "pen" | "pencil" | "highlighter" | "eraser";
type Color = "black" | "blue" | "red" | "green" | "yellow";

type Note = {
  id: string;
  title: string;
  content: string;
  type: "text" | "drawing";
  date: string;
  drawingUrl?: string;
};

export default function NotesCard() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Project Ideas",
      content: "1. Build a personal dashboard\n2. Create a habit tracker\n3. Design a new portfolio",
      type: "text",
      date: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Meeting Notes",
      content: "Discussed project timeline and deliverables. Next steps: reach out to design team.",
      type: "text",
      date: new Date().toISOString(),
    }
  ]);
  
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool>("pen");
  const [selectedColor, setSelectedColor] = useState<Color>("black");
  const [isDrawing, setIsDrawing] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    type: "text" as const,
  });
  const [drawingMode, setDrawingMode] = useState(false);
  const [canvasUrl, setCanvasUrl] = useState<string | null>(null);

  const handleSaveTextNote = () => {
    if (!newNote.title.trim()) {
      toast.error("Please enter a note title");
      return;
    }
    
    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      type: "text",
      date: new Date().toISOString(),
    };
    
    setNotes([note, ...notes]);
    setNewNote({
      title: "",
      content: "",
      type: "text",
    });
    setIsAddingNote(false);
    toast.success("Note saved");
  };

  const handleSaveDrawing = () => {
    if (!newNote.title.trim()) {
      toast.error("Please enter a note title");
      return;
    }
    
    if (!canvasUrl) {
      toast.error("Drawing is empty");
      return;
    }
    
    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: "Drawing note",
      type: "drawing",
      date: new Date().toISOString(),
      drawingUrl: canvasUrl,
    };
    
    setNotes([note, ...notes]);
    setNewNote({
      title: "",
      content: "",
      type: "text",
    });
    setCanvasUrl(null);
    setIsAddingNote(false);
    setDrawingMode(false);
    toast.success("Drawing saved");
  };

  const handleCancelDrawing = () => {
    setCanvasUrl(null);
    setDrawingMode(false);
    // If there's no text note either, close the dialog
    if (!newNote.content.trim()) {
      setIsAddingNote(false);
    }
  };

  const startDrawingMode = () => {
    setDrawingMode(true);
    // We would initialize the canvas here in a real implementation
  };

  const simulateDrawing = () => {
    // This is just a simulation of drawing - in a real app, we would use canvas
    setIsDrawing(true);
    setTimeout(() => {
      // Simulate a drawing being created
      setCanvasUrl("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAgMTAgQzkwIDEwIDkwIDE5MCAxOTAgMTkwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3N2Zz4=");
      setIsDrawing(false);
      toast.success("Drawing created! Click Save to keep it.");
    }, 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle>Notes</CardTitle>
        <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsAddingNote(true)}
          >
            <Plus size={16} />
          </Button>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Note</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex gap-2 mb-2">
                <Button 
                  variant={!drawingMode ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setDrawingMode(false)}
                  className="flex-1"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Text
                </Button>
                <Button 
                  variant={drawingMode ? "default" : "outline"} 
                  size="sm" 
                  onClick={startDrawingMode}
                  className="flex-1"
                >
                  <Pen className="h-4 w-4 mr-2" />
                  Drawing
                </Button>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <input
                  id="title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  placeholder="Note title"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              
              {drawingMode ? (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium">Drawing Tools</h4>
                    {isDrawing && <Badge variant="outline">Drawing...</Badge>}
                  </div>
                  
                  {/* Drawing tools */}
                  <ToggleGroup type="single" value={selectedTool} onValueChange={(value) => value && setSelectedTool(value as Tool)}>
                    <ToggleGroupItem value="pen">
                      <Pen className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="pencil">
                      <Pencil className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="highlighter">
                      <Highlighter className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="eraser">
                      <Eraser className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                  
                  {/* Color selector */}
                  <div className="flex gap-2 mt-2">
                    {["black", "blue", "red", "green", "yellow"].map((color) => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded-full bg-${color}-500 ${
                          selectedColor === color ? "ring-2 ring-offset-2 ring-primary" : ""
                        }`}
                        onClick={() => setSelectedColor(color as Color)}
                      />
                    ))}
                  </div>
                  
                  {/* Drawing canvas (simulated) */}
                  <div className="border rounded-md mt-4 bg-white" style={{ height: "200px" }}>
                    {canvasUrl ? (
                      <div className="h-full flex items-center justify-center">
                        <img src={canvasUrl} alt="Your drawing" className="max-h-full" />
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center">
                        <Button
                          variant="outline"
                          onClick={simulateDrawing}
                          disabled={isDrawing}
                        >
                          {isDrawing ? "Drawing..." : "Click to start drawing"}
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          In a real app, this would be a canvas you can draw on
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {canvasUrl && (
                    <div className="flex justify-end gap-2 mt-2">
                      <Button variant="outline" size="sm" onClick={handleCancelDrawing}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid gap-2">
                  <label htmlFor="content" className="text-sm font-medium">
                    Content
                  </label>
                  <Textarea
                    id="content"
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    placeholder="Write your note here..."
                    className="min-h-[100px]"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAddingNote(false);
                setDrawingMode(false);
                setCanvasUrl(null);
              }}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button onClick={drawingMode ? handleSaveDrawing : handleSaveTextNote}>
                <Check className="h-4 w-4 mr-1" />
                Save Note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[300px] overflow-auto pr-1">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note.id} className="p-3 border rounded-md">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{note.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {note.type === "drawing" ? "Drawing" : "Text"}
                  </Badge>
                </div>
                <div className="mt-2">
                  {note.type === "drawing" && note.drawingUrl ? (
                    <div className="bg-white p-2 rounded border max-h-[100px] overflow-hidden">
                      <img src={note.drawingUrl} alt={note.title} className="max-h-full mx-auto" />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground truncate">{note.content}</p>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {formatDate(note.date)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-6 w-6 mx-auto mb-2 opacity-50" />
              <p>No notes yet</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setIsAddingNote(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Note
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
