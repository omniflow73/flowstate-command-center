
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import PlaceholderPage from "./pages/PlaceholderPage";
import TasksPage from "./pages/TasksPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import { useEffect, useState } from "react";

// Create a new query client with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Get the base URL from the window location
const getBasePath = () => {
  const path = window.location.pathname;
  // Check if we're on a path like /flowstate-command-center/
  if (path.includes('/flowstate-command-center')) {
    return '/flowstate-command-center';
  }
  return '';
};

const baseUrl = getBasePath();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Log current path information and handle initial loading
  useEffect(() => {
    console.log("Current path:", window.location.pathname);
    console.log("Base URL:", baseUrl);
    
    // Add a small timeout to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={baseUrl}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/command-center" element={<PlaceholderPage />} />
            <Route path="/focus" element={<PlaceholderPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/calendar" element={<PlaceholderPage />} />
            <Route path="/time-tracking" element={<PlaceholderPage />} />
            <Route path="/habits" element={<PlaceholderPage />} />
            <Route path="/notes" element={<PlaceholderPage />} />
            <Route path="/projects" element={<PlaceholderPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
