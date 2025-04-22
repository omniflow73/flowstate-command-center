import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function NotesPage() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<string[]>([]);

  useEffect(() => {
    const savedNotes = localStorage.getItem("flowstate_notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const saveNotes = (updatedNotes: string[]) => {
    localStorage.setItem("flowstate_notes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    const updated = [...notes, note];
    saveNotes(updated);
    setNote("");
  };

  const handleDeleteNote = (index: number) => {
    const updated = notes.filter((_, i) => i !== index);
    saveNotes(updated);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Notes</h2>

      <Textarea
        placeholder="Write a new note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <Button onClick={handleAddNote}>Add Note</Button>

      <div className="space-y-4">
        {notes.length === 0 && <p className="text-muted-foreground">No notes yet.</p>}
        {notes.map((n, i) => (
          <div
            key={i}
            className="bg-muted p-4 rounded-md flex items-start justify-between"
          >
            <p className="whitespace-pre-wrap">{n}</p>
            <Button variant="ghost" size="sm" onClick={() => handleDeleteNote(i)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
