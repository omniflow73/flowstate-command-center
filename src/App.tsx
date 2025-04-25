
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
import TimeTrackingPage from "./pages/TimeTrackingPage";
import HabitsPage from "./pages/HabitsPage";
import FocusModePage from "./pages/FocusModePage";
import CommandCenterPage from "./pages/CommandCenterPage";
import { useEffect, useState } from "react";
import { UserProfileProvider } from "./context/UserProfileContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const getBasePath = () => {
  // Simplify this logic to avoid routing issues
  return '';
};

const baseUrl = getBasePath();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Current path:", window.location.pathname);
    console.log("Base URL:", baseUrl);
    
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
        <UserProfileProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={baseUrl}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/command-center" element={<CommandCenterPage />} />
              <Route path="/focus" element={<FocusModePage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/calendar" element={<PlaceholderPage />} />
              <Route path="/time-tracking" element={<TimeTrackingPage />} />
              <Route path="/habits" element={<HabitsPage />} />
              <Route path="/notes" element={<PlaceholderPage />} />
              <Route path="/projects" element={<PlaceholderPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </UserProfileProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
