
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Lightbulb, Sparkles, Send, Book, Calendar, Clock, Brain, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const generateAIResponse = (prompt: string): Promise<string> => {
  const keywordResponses: Record<string, string> = {
    "hello": "Hello! How can I assist you today with your productivity needs?",
    "help": "I can help you with task management, focus techniques, scheduling, and productivity advice. What would you like to know about?",
    "focus": "To improve focus, try the Pomodoro technique: 25 minutes of focused work followed by a 5-minute break. Also, consider minimizing distractions by closing unnecessary apps and tabs.",
    "task": "For effective task management, try prioritizing your tasks using the Eisenhower matrix: urgent & important, important but not urgent, urgent but not important, and neither.",
    "time management": "For better time management, try time blocking your calendar and allocating specific time slots for different types of work. Also, consider tracking your time to identify patterns and areas for improvement.",
    "productivity": "To boost productivity, ensure you're taking regular breaks, staying hydrated, and getting enough sleep. Also, try to batch similar tasks together to minimize context switching.",
    "pomodoro": "The Pomodoro Technique involves working for 25 minutes, then taking a 5-minute break. After 4 pomodoros, take a longer 15-30 minute break. This helps maintain focus while preventing burnout.",
    "goals": "When setting goals, make them SMART: Specific, Measurable, Achievable, Relevant, and Time-bound. This framework helps create clear and actionable objectives.",
    "schedule": "I recommend using the time blocking method for scheduling. Divide your day into blocks dedicated to specific tasks or types of work. This helps maintain focus and ensures important tasks get done.",
    "procrastination": "To overcome procrastination, try breaking tasks into smaller, manageable parts. The '2-minute rule' can also help: if a task takes less than 2 minutes, do it immediately rather than putting it off.",
    "note taking": "For effective note-taking, try the Cornell method or mind mapping. Digital tools like Notion or Obsidian can help organize your notes with backlinks and tags for easy retrieval.",
    "sleep": "Good sleep is crucial for productivity. Aim for 7-9 hours per night, maintain a consistent sleep schedule, and avoid screens at least an hour before bed.",
    "burnout": "To prevent burnout, ensure you're taking regular breaks, setting boundaries between work and personal life, and making time for activities that recharge you.",
    "habits": "Habit formation typically takes 21-66 days. To build new habits, start small, be consistent, stack them with existing habits, and track your progress.",
    "meeting": "For productive meetings, always have a clear agenda, set a time limit, invite only essential participants, and end with clear action items and responsibilities.",
  };

  return new Promise((resolve) => {
    const typingDelay = 1000 + Math.random() * 1000;
    
    setTimeout(() => {
      const promptLower = prompt.toLowerCase();
      
      for (const [keyword, response] of Object.entries(keywordResponses)) {
        if (promptLower.includes(keyword.toLowerCase())) {
          resolve(response);
          return;
        }
      }
      
      const defaultResponses = [
        "I understand your question about " + prompt.split(" ").slice(0, 3).join(" ") + "... To address this effectively, I'd recommend focusing on one small step at a time and measuring your progress.",
        "That's an interesting question about productivity. Based on research, consistency is more important than perfection when building new habits. Try to establish a regular routine first.",
        "I'd suggest breaking down this problem into smaller, manageable tasks. What specific aspect would you like to focus on first? This will help make progress more measurable.",
        "From a productivity perspective, this is a common challenge. Many users find that setting clear boundaries and specific time blocks helps address this. Would you like me to help you create a time blocking schedule?",
        "I see you're interested in optimizing your workflow. Consider the 2-minute rule: if a task takes less than 2 minutes, do it immediately rather than scheduling it for later. This prevents small tasks from piling up.",
        "Based on productivity research, our brains work best in focused 90-minute cycles. Try structuring your work in 90-minute blocks with short breaks in between for optimal cognitive performance.",
        "This is a great opportunity to apply the 80/20 principle (Pareto Principle). Which 20% of your efforts might produce 80% of the results you're looking for?",
      ];
      
      const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      resolve(randomResponse);
    }, typingDelay);
  });
};

type Message = {
  role: "assistant" | "user";
  content: string;
};

type AIMode = "productivity" | "schedule" | "learning" | "focus" | "reflection";

export default function AIAssistantCard() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI productivity assistant. How can I help you today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentMode, setCurrentMode] = useState<AIMode>("productivity");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      role: "user" as const,
      content: inputValue.trim(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    
    try {
      const response = await generateAIResponse(userMessage.content);
      
      setMessages(prev => [...prev, {
        role: "assistant" as const,
        content: response,
      }]);
    } catch (error) {
      toast.error("Failed to get AI response. Please try again.");
      console.error("AI response error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const getModeIcon = (mode: AIMode) => {
    switch(mode) {
      case "productivity": return <Sparkles className="h-4 w-4" />;
      case "schedule": return <Calendar className="h-4 w-4" />;
      case "learning": return <Book className="h-4 w-4" />;
      case "focus": return <Clock className="h-4 w-4" />;
      case "reflection": return <Brain className="h-4 w-4" />;
    }
  };

  const getModeSuggestions = (mode: AIMode): string[] => {
    switch(mode) {
      case "productivity":
        return ["How can I be more productive?", "Productivity tips", "Time management", "Focus techniques"];
      case "schedule":
        return ["How to plan my day", "Time blocking tips", "Best way to schedule tasks", "Prioritizing my calendar"];
      case "learning":
        return ["How to learn faster", "Note-taking techniques", "Best way to retain information", "Learning new skills"];
      case "focus":
        return ["How to improve focus", "Deep work techniques", "Eliminating distractions", "Focus exercises"];
      case "reflection":
        return ["Daily reflection prompts", "How to journal effectively", "Mindfulness techniques", "Weekly review process"];
    }
  };

  const changeMode = (mode: AIMode) => {
    setCurrentMode(mode);
    setMessages(prev => [
      ...prev, 
      {
        role: "assistant" as const,
        content: `I've switched to ${mode} mode. How can I help you with your ${mode} today?`
      }
    ]);
  };

  const suggestions = getModeSuggestions(currentMode);

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const clearChat = () => {
    setMessages([{
      role: "assistant" as const,
      content: `Chat cleared. I'm ready to help you with your ${currentMode}.`,
    }]);
    toast.success("Chat history cleared");
  };

  return (
    <Card className="glass-card flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI Assistant
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeMode("productivity")}>
                <Sparkles className="h-4 w-4 mr-2" />
                Productivity Mode
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeMode("schedule")}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Mode
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeMode("learning")}>
                <Book className="h-4 w-4 mr-2" />
                Learning Mode
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeMode("focus")}>
                <Clock className="h-4 w-4 mr-2" />
                Focus Mode
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeMode("reflection")}>
                <Brain className="h-4 w-4 mr-2" />
                Reflection Mode
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={clearChat}>
                Clear Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            {getModeIcon(currentMode)}
            {currentMode.charAt(0).toUpperCase() + currentMode.slice(1)} Mode
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-[240px]">
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
          {isTyping && (
            <div className="bg-muted max-w-[80%] p-3 rounded-lg">
              <div className="flex space-x-2">
                <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <Lightbulb className="h-3.5 w-3.5" />
              {suggestion}
            </Button>
          ))}
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask your AI assistant..."
            className="glass-input flex-1"
            disabled={isTyping}
          />
          <Button type="submit" size="icon" className="bg-gradient-primary hover:opacity-90" disabled={isTyping || !inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
