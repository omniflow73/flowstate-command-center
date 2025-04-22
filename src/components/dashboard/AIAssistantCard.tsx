
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Lightbulb, Sparkles, Send } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function AIAssistantCard() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your AI productivity assistant. How can I help you today?",
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      role: "user",
      content: inputValue.trim(),
    };
    
    // Add assistant response (in a real app, this would come from an API)
    const assistantMessage = {
      role: "assistant",
      content: "I'm a simulated AI assistant. In the real app, I'd provide intelligent responses based on your input.",
    };
    
    setMessages([...messages, userMessage, assistantMessage]);
    setInputValue("");
  };

  const suggestions = [
    "Summarize my day",
    "Focus recommendations",
    "Plan my week",
  ];

  return (
    <Card className="glass-card flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={cn(
                "max-w-[80%] p-3 rounded-lg",
                message.role === "user" 
                  ? "ml-auto bg-primary text-primary-foreground" 
                  : "bg-muted"
              )}
            >
              {message.content}
            </div>
          ))}
        </div>
        
        {/* Suggestions */}
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
              onClick={() => setInputValue(suggestion)}
            >
              <Lightbulb className="h-3.5 w-3.5" />
              {suggestion}
            </Button>
          ))}
        </div>
        
        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask your AI assistant..."
            className="glass-input flex-1"
          />
          <Button type="submit" size="icon" className="bg-gradient-primary hover:opacity-90">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
