
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Lightbulb, Sparkles, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock AI response generator to simulate real AI behavior
const generateAIResponse = (prompt: string): Promise<string> => {
  // Mapping of keywords to specific responses
  const keywordResponses: Record<string, string> = {
    "hello": "Hello! How can I assist you today with your productivity needs?",
    "help": "I can help you with task management, focus techniques, scheduling, and productivity advice. What would you like to know about?",
    "focus": "To improve focus, try the Pomodoro technique: 25 minutes of focused work followed by a 5-minute break. Also, consider minimizing distractions by closing unnecessary apps and tabs.",
    "task": "For effective task management, try prioritizing your tasks using the Eisenhower matrix: urgent & important, important but not urgent, urgent but not important, and neither.",
    "time management": "For better time management, try time blocking your calendar and allocating specific time slots for different types of work. Also, consider tracking your time to identify patterns and areas for improvement.",
    "productivity": "To boost productivity, ensure you're taking regular breaks, staying hydrated, and getting enough sleep. Also, try to batch similar tasks together to minimize context switching.",
    "pomodoro": "The Pomodoro Technique involves working for 25 minutes, then taking a 5-minute break. After 4 pomodoros, take a longer 15-30 minute break. This helps maintain focus while preventing burnout.",
    "goals": "When setting goals, make them SMART: Specific, Measurable, Achievable, Relevant, and Time-bound. This framework helps create clear and actionable objectives.",
  };

  return new Promise((resolve) => {
    // Simulate typing delay for realism
    const typingDelay = 1500 + Math.random() * 1500;
    
    setTimeout(() => {
      // Check for keyword matches
      const promptLower = prompt.toLowerCase();
      
      for (const [keyword, response] of Object.entries(keywordResponses)) {
        if (promptLower.includes(keyword.toLowerCase())) {
          resolve(response);
          return;
        }
      }
      
      // Default responses if no keywords match
      const defaultResponses = [
        "I understand your question about " + prompt.split(" ").slice(0, 3).join(" ") + "... To address this effectively, I'd recommend focusing on one small step at a time.",
        "That's an interesting question about productivity. Based on research, consistency is more important than perfection when building new habits.",
        "I'd suggest breaking down this problem into smaller, manageable tasks. What specific aspect would you like to focus on first?",
        "From a productivity perspective, this is a common challenge. Many users find that setting clear boundaries and specific time blocks helps address this.",
        "I see you're interested in optimizing your workflow. Consider the 2-minute rule: if a task takes less than 2 minutes, do it immediately rather than scheduling it for later.",
      ];
      
      const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      resolve(randomResponse);
    }, typingDelay);
  });
};

export default function AIAssistantCard() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your AI productivity assistant. How can I help you today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      role: "user",
      content: inputValue.trim(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    
    try {
      // Get AI response
      const response = await generateAIResponse(userMessage.content);
      
      // Add assistant response
      setMessages(prev => [...prev, {
        role: "assistant",
        content: response,
      }]);
    } catch (error) {
      toast.error("Failed to get AI response. Please try again.");
      console.error("AI response error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    "Help me focus",
    "Productivity tips",
    "Time management",
    "Pomodoro technique",
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <Card className="glass-card flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI Assistant
        </CardTitle>
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
        
        {/* Suggestions */}
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
        
        {/* Input form */}
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
