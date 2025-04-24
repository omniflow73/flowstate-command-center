
import React, { useEffect } from "react";
import { 
  Calendar, CheckSquare, Clock, Folder, 
  Home, LayoutGrid, Settings, UserCircle, 
  PenSquare, BarChart2, Star, Boxes, Focus, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

type SidebarProps = {
  isOpen: boolean;
};

type NavItemProps = {
  icon: React.ElementType;
  label: string;
  to: string;
  badge?: number;
};

const NavItem = ({ icon: Icon, label, to, badge }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to}>
      <div 
        className={cn(
          "flex items-center px-3 py-2 my-1 rounded-lg cursor-pointer transition-colors",
          isActive 
            ? "bg-primary text-primary-foreground shadow-sm"
            : "hover:bg-muted"
        )}
      >
        <Icon className="h-5 w-5 mr-3" />
        <span className="font-medium">{label}</span>
        {badge && (
          <span className="ml-auto bg-accent/80 text-xs font-semibold px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
};

const SidebarSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <h3 className="px-3 text-xs uppercase font-semibold text-muted-foreground mb-2">
      {title}
    </h3>
    <div>{children}</div>
  </div>
);

export default function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();
  
  return (
    <div 
      className={cn(
        "fixed inset-y-0 left-0 z-20 w-64 border-r bg-sidebar transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <h2 className="text-xl font-bold text-gradient">FlowState</h2>
      </div>
      <div className="h-[calc(100vh-4rem)] overflow-y-auto py-4 px-2">
        <SidebarSection title="Overview">
          <NavItem icon={Home} label="Dashboard" to="/" />
          <NavItem icon={LayoutGrid} label="Command Center" to="/command-center" />
          <NavItem icon={Focus} label="Focus Mode" to="/focus" />
        </SidebarSection>
        
        <SidebarSection title="Productivity">
          <NavItem icon={CheckSquare} label="Tasks" to="/tasks" badge={5} />
          <NavItem icon={Calendar} label="Calendar" to="/calendar" />
          <NavItem icon={Clock} label="Time Tracking" to="/time-tracking" />
          <NavItem icon={Activity} label="Habits" to="/habits" />
        </SidebarSection>
        
        <SidebarSection title="Workspace">
          <NavItem icon={PenSquare} label="Notes" to="/notes" />
          <NavItem icon={Folder} label="Projects" to="/projects" />
          <NavItem icon={BarChart2} label="Analytics" to="/analytics" />
        </SidebarSection>
        
        <SidebarSection title="Account">
          <NavItem icon={UserCircle} label="Profile" to="/profile" />
          <NavItem icon={Settings} label="Settings" to="/settings" />
        </SidebarSection>
      </div>
    </div>
  );
}
