
import React from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";

export default function PlaceholderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const pageName = location.pathname.replace('/', '') || 'unknown';
  const [newItemText, setNewItemText] = useState("");
  const [items, setItems] = useState<string[]>([]);

  const handleAddItem = () => {
    if (newItemText.trim()) {
      setItems([...items, newItemText]);
      setNewItemText("");
      toast.success(`New ${getSingularName(pageName)} added!`);
    } else {
      toast.error("Please enter some text");
    }
  };

  const getSingularName = (name: string) => {
    // Convert plural names to singular for toast messages
    if (name.endsWith('s')) return name.slice(0, -1);
    if (name === 'focus') return 'focus session';
    if (name === 'command-center') return 'command';
    return name;
  };

  const getPlaceholderText = () => {
    switch(pageName) {
      case 'tasks': return 'Enter new task...';
      case 'notes': return 'Enter note title...';
      case 'projects': return 'Enter project name...';
      case 'habits': return 'Enter new habit...';
      case 'focus': return 'Enter focus session name...';
      case 'calendar': return 'Enter event title...';
      case 'time-tracking': return 'Enter activity name...';
      case 'command-center': return 'Enter new command...';
      case 'analytics': return 'Enter metric name...';
      default: return 'Enter new item...';
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
        <h1 className="text-3xl font-bold">{pageName.charAt(0).toUpperCase() + pageName.slice(1).replace('-', ' ')}</h1>
        <p className="text-muted-foreground">
          Manage your {pageName.replace('-', ' ')} and stay organized.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Add New {getSingularName(pageName)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input 
              placeholder={getPlaceholderText()} 
              value={newItemText} 
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
            />
            <Button onClick={handleAddItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your {pageName.charAt(0).toUpperCase() + pageName.slice(1).replace('-', ' ')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li key={index} className="p-3 bg-secondary/30 rounded-md flex justify-between">
                  {item}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setItems(items.filter((_, i) => i !== index));
                      toast.success(`${getSingularName(pageName)} removed`);
                    }}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
