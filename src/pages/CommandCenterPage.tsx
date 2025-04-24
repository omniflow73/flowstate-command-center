import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileCheck, Folder, Star as StarFilled, GitBranch, GitPullRequest,
  ListChecks, Trello, Boxes, Database, Layout, MoreVertical,
  ChevronRight, Activity, ArrowRightCircle, ExternalLink, BarChart2,
  Focus, Calculator, Terminal, Play, Check, X, Clock
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { BackButton } from "@/components/ui/back-button";

interface Project {
  id: string;
  name: string;
  tasks: { name: string; completed: boolean }[];
}

interface Task {
  id: string;
  name: string;
  completed: boolean;
}

interface QuickAction {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  route?: string;
  onClick?: () => void;
}

const initialProjects: Project[] = [
  {
    id: "proj-1",
    name: "Website Redesign",
    tasks: [
      { id: "task-1", name: "Design mockups", completed: true },
      { id: "task-2", name: "Develop frontend", completed: false },
    ],
  },
  {
    id: "proj-2",
    name: "Mobile App Development",
    tasks: [
      { id: "task-3", name: "Plan user stories", completed: false },
      { id: "task-4", name: "Design UI", completed: false },
    ],
  },
];

const initialTasks: Task[] = [
  { id: "task-5", name: "Review code", completed: false },
  { id: "task-6", name: "Write documentation", completed: true },
];

export default function CommandCenterPage() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [projects, setProjects] = useState(initialProjects);
  const [tasks, setTasks] = useState(initialTasks);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [newTaskName, setNewTaskName] = useState("");
  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);
  const [workflowProgress, setWorkflowProgress] = useState(0);
  const navigate = useNavigate();
  
  // This function will be replaced to use route navigation instead of embedded links
  const handleQuickActionClick = (action: QuickAction) => {
    if (action.route) {
      navigate(action.route);
    } else if (action.onClick) {
      action.onClick();
    }
  };

  // Update the quick actions to use routes instead of links
  const quickActions = [
    {
      id: "focus",
      name: "Enter Focus Mode",
      description: "Start a focused work session",
      icon: Focus,
      route: "/focus",
    },
    {
      id: "tasks",
      name: "View Tasks",
      description: "Check your pending tasks",
      icon: ListChecks,
      route: "/tasks",
    },
    {
      id: "time",
      name: "Track Time",
      description: "Start time tracking",
      icon: Clock,
      route: "/time-tracking",
    },
    {
      id: "habits",
      name: "Habits Dashboard",
      description: "Track your habits",
      icon: Activity,
      route: "/habits",
    },
    {
      id: "analytics",
      name: "View Analytics",
      description: "See your productivity stats",
      icon: BarChart2,
      route: "/analytics",
    },
  ];

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleTaskComplete = (projectId: string, taskId: string) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
              ),
            }
          : project
      )
    );
  };

  const handleAddTask = () => {
    if (!selectedProjectId || !newTaskName.trim()) return;

    const newTask = {
      id: `task-${Date.now()}`,
      name: newTaskName,
      completed: false,
    };

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === selectedProjectId
          ? { ...project, tasks: [...project.tasks, newTask] }
          : project
      )
    );

    setNewTaskName("");
  };

  const handleAddProject = () => {
    if (!newProjectName.trim()) return;

    const newProject = {
      id: `proj-${Date.now()}`,
      name: newProjectName,
      tasks: [],
    };

    setProjects([...projects, newProject]);
    setNewProjectName("");
    setIsAddingProject(false);
  };

  const startWorkflow = () => {
    setIsWorkflowRunning(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setWorkflowProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsWorkflowRunning(false);
      }
    }, 300);
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <BackButton />
      <h1 className="text-3xl font-bold mb-6">Command Center</h1>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Open Command</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
          </DialogHeader>
          <Command>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Projects">
                {filteredProjects.slice(0, 5).map((project) => (
                  <CommandItem key={project.id}>{project.name}</CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading="Settings">
                <CommandItem>Profile</CommandItem>
                <CommandItem>Appearance</CommandItem>
                <CommandItem>Keyboard Shortcuts</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
      
      {/* Fix for Quick Actions section to use navigation instead of embedded links */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {quickActions.map((action) => (
          <Card 
            key={action.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleQuickActionClick(action)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{action.name}</CardTitle>
                </div>
                <Button variant="ghost" size="icon">
                  <ArrowRightCircle className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Manage your ongoing projects and tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Input
              type="search"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={() => setIsAddingProject(true)}>Add Project</Button>
          </div>
          {isAddingProject ? (
            <div className="flex items-center mb-4">
              <Input
                type="text"
                placeholder="Project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
              <Button onClick={handleAddProject} className="ml-2">
                Create
              </Button>
              <Button variant="ghost" onClick={() => setIsAddingProject(false)}>
                Cancel
              </Button>
            </div>
          ) : null}
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="mb-4">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle
                        className="cursor-pointer"
                        onClick={() => handleProjectSelect(project.id)}
                      >
                        {project.name}
                      </CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <FileCheck className="mr-2 h-4 w-4" />
                            Mark as Complete
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Folder className="mr-2 h-4 w-4" />
                            Add to Team
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <GitBranch className="mr-2 h-4 w-4" />
                            Share Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul>
                      {project.tasks.map((task) => (
                        <li key={task.id} className="flex items-center justify-between">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => handleTaskComplete(project.id, task.id)}
                              className="mr-2"
                            />
                            {task.name}
                          </label>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <FileCheck className="mr-2 h-4 w-4" />
                                Mark as Complete
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Folder className="mr-2 h-4 w-4" />
                                Add to Team
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <GitBranch className="mr-2 h-4 w-4" />
                                Share Project
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </li>
                      ))}
                    </ul>
                    {selectedProjectId === project.id ? (
                      <div className="flex items-center mt-4">
                        <Input
                          type="text"
                          placeholder="New task name"
                          value={newTaskName}
                          onChange={(e) => setNewTaskName(e.target.value)}
                        />
                        <Button onClick={handleAddTask} className="ml-2">
                          Add Task
                        </Button>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="active">
              <div>Active Projects Content</div>
            </TabsContent>
            <TabsContent value="completed">
              <div>Completed Projects Content</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
       
      {/* Remember to close the Tabs component properly */}
      <Card>
        <CardHeader>
          <CardTitle>Workflows</CardTitle>
          <CardDescription>Automated task sequences for common activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="productivity">
            <TabsList className="mb-4">
              <TabsTrigger value="productivity">Productivity</TabsTrigger>
              <TabsTrigger value="project">Project</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
            </TabsList>
            
            <TabsContent value="productivity">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <ListChecks className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Morning Routine</h3>
                      <p className="text-sm text-muted-foreground">
                        Start your day with a set of productive tasks
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Trello className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Project Kickoff</h3>
                      <p className="text-sm text-muted-foreground">
                        Initiate a new project with predefined steps
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="project">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Database className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Data Migration</h3>
                      <p className="text-sm text-muted-foreground">
                        Migrate data between databases
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="personal">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Layout className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">System Update</h3>
                      <p className="text-sm text-muted-foreground">
                        Keep your system up-to-date
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
