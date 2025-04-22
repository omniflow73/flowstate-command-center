
import React from "react";
import { 
  Calendar, CheckSquare, Clock, Folder, 
  Home, LayoutGrid, Settings, UserCircle, 
  PenSquare, BarChart2, Star, Boxes
} from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarProps = {
  isOpen: boolean;
};

type NavItemProps = {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  badge?: number;
};

const NavItem = ({ icon: Icon, label, active, badge }: NavItemProps) => (
  <div 
    className={cn(
      "flex items-center px-3 py-2 my-1 rounded-lg cursor-pointer transition-colors",
      active 
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
);

const SidebarSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <h3 className="px-3 text-xs uppercase font-semibold text-muted-foreground mb-2">
      {title}
    </h3>
    <div>{children}</div>
  </div>
);

export default function Sidebar({ isOpen }: SidebarProps) {
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
          <NavItem icon={Home} label="Dashboard" active />
          <NavItem icon={LayoutGrid} label="Command Center" />
          <NavItem icon={Star} label="Focus Mode" />
        </SidebarSection>
        
        <SidebarSection title="Productivity">
          <NavItem icon={CheckSquare} label="Tasks" badge={5} />
          <NavItem icon={Calendar} label="Calendar" />
          <NavItem icon={Clock} label="Time Tracking" />
          <NavItem icon={Boxes} label="Habits" />
        </SidebarSection>
        
        <SidebarSection title="Workspace">
          <NavItem icon={PenSquare} label="Notes" />
          <NavItem icon={Folder} label="Projects" />
          <NavItem icon={BarChart2} label="Analytics" />
        </SidebarSection>
        
        <SidebarSection title="Account">
          <NavItem icon={UserCircle} label="Profile" />
          <NavItem icon={Settings} label="Settings" />
        </SidebarSection>
      </div>
    </div>
  );
}
