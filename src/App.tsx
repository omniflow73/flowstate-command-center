
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import PlaceholderPage from "./pages/PlaceholderPage";
import TasksPage from "./pages/TasksPage";
import AnalyticsPage from "./pages/AnalyticsPage";

const queryClient = new QueryClient();

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

const App = () => (
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

export default App;
