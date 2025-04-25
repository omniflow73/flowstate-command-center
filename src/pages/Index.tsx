
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import StatsCard from "@/components/dashboard/StatsCard";
import GreetingCard from "@/components/dashboard/GreetingCard";
import TaskCard from "@/components/dashboard/TaskCard";
import CalendarCard from "@/components/dashboard/CalendarCard";
import PomodoroCard from "@/components/dashboard/PomodoroCard";
import HabitTrackerCard from "@/components/dashboard/HabitTrackerCard";
import AIAssistantCard from "@/components/dashboard/AIAssistantCard";
import ProjectsCard from "@/components/dashboard/ProjectsCard";
import TimeBlockingCard from "@/components/dashboard/TimeBlockingCard";
import NotesCard from "@/components/dashboard/NotesCard";
import { Button } from "@/components/ui/button";
import { Layout, Grid3X3 } from "lucide-react";
import QuickAdd from "@/components/dashboard/QuickAdd";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<"comfortable" | "compact">("comfortable");
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
    window.scrollTo(0, 0);
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`transition-all duration-300 ease-in-out min-h-screen ${
        sidebarOpen ? "ml-0 md:ml-64" : "ml-0"
      }`}>
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="p-4 md:p-6">
          <div className="max-w-[2000px] mx-auto space-y-6">
            {/* Header section with actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <GreetingCard />
              <div className="flex items-center gap-2">
                <QuickAdd />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode(prev => prev === "comfortable" ? "compact" : "comfortable")}
                >
                  {viewMode === "comfortable" ? (
                    <Layout className="h-4 w-4" />
                  ) : (
                    <Grid3X3 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Stats Overview */}
            <section>
              <StatsCard />
            </section>

            {/* Main dashboard grid */}
            <div className={`grid gap-6 ${
              viewMode === "comfortable" 
                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                : "grid-cols-1 md:grid-cols-3 xl:grid-cols-4"
            }`}>
              <div className="space-y-6">
                <TaskCard />
                <PomodoroCard />
              </div>
              
              <div className="space-y-6">
                <CalendarCard />
                <ProjectsCard />
              </div>
              
              <div className="space-y-6">
                <HabitTrackerCard />
                <TimeBlockingCard />
              </div>

              {viewMode === "comfortable" && (
                <div className="space-y-6 md:col-span-2 xl:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <NotesCard />
                    <AIAssistantCard />
                  </div>
                </div>
              )}

              {viewMode === "compact" && (
                <>
                  <div className="space-y-6">
                    <NotesCard />
                  </div>
                  <div className="space-y-6">
                    <AIAssistantCard />
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
