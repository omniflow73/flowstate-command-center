
import { useState } from "react";
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

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  
  // Auto-close sidebar on mobile
  if (isMobile && sidebarOpen) {
    setSidebarOpen(false);
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Sidebar isOpen={sidebarOpen} />
      
      <div 
        className={`transition-all duration-300 ease-in-out min-h-screen ${
          sidebarOpen ? "ml-0 md:ml-64" : "ml-0"
        }`}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
          <div className="space-y-6">
            {/* Greeting section */}
            <GreetingCard />
            
            {/* Stats Overview */}
            <div className="py-2">
              <h2 className="text-lg font-semibold mb-3">Performance Overview</h2>
              <StatsCard />
            </div>
            
            {/* Main dashboard content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* First column */}
              <div className="space-y-6">
                <TaskCard />
                <ProjectsCard />
              </div>
              
              {/* Second column */}
              <div className="space-y-6">
                <PomodoroCard />
                <HabitTrackerCard />
              </div>
              
              {/* Third column */}
              <div className="space-y-6">
                <CalendarCard />
                <AIAssistantCard />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
