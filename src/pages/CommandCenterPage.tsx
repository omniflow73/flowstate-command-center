
import React, { useState, useEffect, useRef } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from "@/components/ui/card";
import { 
  Command, CommandDialog, CommandEmpty, CommandGroup, 
  CommandInput, CommandItem, CommandList, CommandShortcut
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Separator } from "@/components/ui/separator";
import { 
  MenubarMenu, Menubar, MenubarTrigger, MenubarContent, 
  MenubarItem, MenubarSeparator 
} from "@/components/ui/menubar";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { 
  Command as CommandIcon, Search, Calendar, Clock, CheckSquare, 
  FileText, Settings, BookOpen, UserCircle, Home, Plus,
  Grid2X2, Star, Trash2, Edit, Layers, Copy, Share2, 
  FileCheck, Folder, Star as StarFilled, GitBranch, GitPullRequest,
  ListChecks, Trello, Boxes, Database, Layout, MoreVertical,
  ChevronRight, Activity, ArrowRightCircle, ExternalLink, BarChart2,
  Focus, Calculator, Terminal
} from "lucide-react";

// Define interface for quick action
interface QuickAction {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  path?: string;
  shortcuts?: string[];
  action?: () => void;
  category: 'navigation' | 'task' | 'note' | 'calendar' | 'system' | 'automation';
  pinned?: boolean;
}

interface RecentItem {
  id: string;
  name: string;
  type: 'task' | 'note' | 'project' | 'calendar' | 'dashboard';
  icon: React.ReactNode;
  path: string;
  lastAccessed: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  pinnedToHome?: boolean;
}

interface WorkflowStep {
  id: string;
  description: string;
  path?: string;
  completed: boolean;
  action?: () => void;
}

export default function CommandCenterPage() {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pinnedActions, setPinnedActions] = useState<QuickAction[]>(() => {
    const saved = localStorage.getItem('pinnedActions');
    return saved ? JSON.parse(saved) : defaultQuickActions.filter(a => a.pinned);
  });
  
  const [recentItems, setRecentItems] = useState<RecentItem[]>(() => {
    const saved = localStorage.getItem('recentItems');
    return saved ? JSON.parse(saved) : defaultRecentItems;
  });
  
  const [workflows, setWorkflows] = useState<Workflow[]>(() => {
    const saved = localStorage.getItem('workflows');
    return saved ? JSON.parse(saved) : defaultWorkflows;
  });
  
  const [activeTab, setActiveTab] = useState<string>("quickActions");
  const [newWorkflow, setNewWorkflow] = useState<{name: string, description: string}>({
    name: '',
    description: ''
  });
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false);
  const [currentWorkflowSteps, setCurrentWorkflowSteps] = useState<WorkflowStep[]>([]);
  
  const commandInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('pinnedActions', JSON.stringify(pinnedActions));
  }, [pinnedActions]);
  
  useEffect(() => {
    localStorage.setItem('recentItems', JSON.stringify(recentItems));
  }, [recentItems]);
  
  useEffect(() => {
    localStorage.setItem('workflows', JSON.stringify(workflows));
  }, [workflows]);
  
  // Setup keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(true);
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        if (commandInputRef.current) {
          commandInputRef.current.focus();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  const pinAction = (action: QuickAction) => {
    const isPinned = pinnedActions.some(a => a.id === action.id);
    
    if (isPinned) {
      setPinnedActions(pinnedActions.filter(a => a.id !== action.id));
      toast({
        title: "Action Unpinned",
        description: `"${action.name}" has been removed from pinned actions`,
      });
    } else {
      setPinnedActions([...pinnedActions, {...action, pinned: true}]);
      toast({
        title: "Action Pinned",
        description: `"${action.name}" has been added to pinned actions`,
      });
    }
  };
  
  const logRecentItem = (item: RecentItem) => {
    const now = new Date().toISOString();
    
    // Check if item already exists in recents
    const exists = recentItems.some(i => i.id === item.id);
    
    if (exists) {
      // Update last accessed time
      setRecentItems(recentItems.map(i => 
        i.id === item.id ? {...i, lastAccessed: now} : i
      ));
    } else {
      // Add to recents
      setRecentItems([{...item, lastAccessed: now}, ...recentItems.slice(0, 9)]);
    }
  };
  
  const removeRecentItem = (id: string) => {
    setRecentItems(recentItems.filter(item => item.id !== id));
    toast({
      title: "Item Removed",
      description: "Item removed from recent activity",
    });
  };
  
  const handleExecuteAction = (action: QuickAction) => {
    if (action.path) {
      // Log this as a recent item if it has a path
      logRecentItem({
        id: action.id,
        name: action.name,
        type: action.category === 'task' ? 'task' : 
              action.category === 'note' ? 'note' :
              action.category === 'calendar' ? 'calendar' : 'dashboard',
        icon: action.icon,
        path: action.path,
        lastAccessed: new Date().toISOString()
      });
    }
    
    if (action.action) {
      action.action();
    }
    
    toast({
      title: "Action Executed",
      description: `"${action.name}" has been triggered`,
    });
  };
  
  const addWorkflow = () => {
    if (!newWorkflow.name.trim()) {
      toast({
        title: "Error",
        description: "Workflow name is required",
        variant: "destructive",
      });
      return;
    }
    
    if (currentWorkflowSteps.length === 0) {
      toast({
        title: "Error",
        description: "Add at least one step to your workflow",
        variant: "destructive",
      });
      return;
    }
    
    const workflow: Workflow = {
      id: Date.now().toString(),
      name: newWorkflow.name,
      description: newWorkflow.description,
      steps: currentWorkflowSteps
    };
    
    setWorkflows([...workflows, workflow]);
    setIsCreatingWorkflow(false);
    setNewWorkflow({ name: '', description: '' });
    setCurrentWorkflowSteps([]);
    
    toast({
      title: "Workflow Created",
      description: `"${newWorkflow.name}" workflow has been created`,
    });
  };
  
  const addWorkflowStep = (action: QuickAction) => {
    if (!isCreatingWorkflow) return;
    
    const step: WorkflowStep = {
      id: Date.now().toString(),
      description: `Navigate to ${action.name}`,
      path: action.path,
      completed: false
    };
    
    setCurrentWorkflowSteps([...currentWorkflowSteps, step]);
    
    toast({
      title: "Step Added",
      description: `Added "${action.name}" to workflow`,
    });
  };
  
  const removeWorkflowStep = (stepId: string) => {
    setCurrentWorkflowSteps(currentWorkflowSteps.filter(step => step.id !== stepId));
  };
  
  const removeWorkflow = (id: string) => {
    setWorkflows(workflows.filter(workflow => workflow.id !== id));
    
    toast({
      title: "Workflow Deleted",
      description: "Workflow has been removed",
    });
  };
  
  const toggleWorkflowStepCompletion = (workflowId: string, stepId: string) => {
    setWorkflows(workflows.map(workflow => {
      if (workflow.id === workflowId) {
        return {
          ...workflow,
          steps: workflow.steps.map(step => {
            if (step.id === stepId) {
              return {
                ...step,
                completed: !step.completed
              };
            }
            return step;
          })
        };
      }
      return workflow;
    }));
  };
  
  const togglePinWorkflow = (id: string) => {
    setWorkflows(workflows.map(workflow => {
      if (workflow.id === id) {
        return {
          ...workflow,
          pinnedToHome: !workflow.pinnedToHome
        };
      }
      return workflow;
    }));
    
    toast({
      title: "Workflow Updated",
      description: "Workflow pin status has been updated",
    });
  };
  
  // Filter actions based on search query
  const filteredActions = searchQuery 
    ? defaultQuickActions.filter(action => 
        action.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : defaultQuickActions;
    
  const sortedRecentItems = recentItems
    .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime());

  return (
    <div className="container px-4 py-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CommandIcon className="h-8 w-8" />
            Command Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Your personal command hub for quick actions and workflows
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setIsCommandOpen(true)}
            className="min-w-[160px]"
          >
            <Search className="h-4 w-4 mr-2" />
            Quick Search
            <span className="ml-auto text-xs text-muted-foreground">⌘K</span>
          </Button>
        </div>
      </div>
      
      {/* Command Palette Dialog */}
      <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Quick Actions">
            {defaultQuickActions.slice(0, 5).map(action => (
              <CommandItem
                key={action.id}
                onSelect={() => {
                  setIsCommandOpen(false);
                  handleExecuteAction(action);
                }}
              >
                {action.icon}
                <span className="ml-2">{action.name}</span>
                {action.shortcuts && (
                  <CommandShortcut>
                    {action.shortcuts.join('+')}
                  </CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandGroup heading="Navigation">
            {defaultQuickActions
              .filter(action => action.category === 'navigation')
              .map(action => (
                <CommandItem
                  key={action.id}
                  onSelect={() => {
                    setIsCommandOpen(false);
                    handleExecuteAction(action);
                  }}
                >
                  {action.icon}
                  <span className="ml-2">{action.name}</span>
                  {action.shortcuts && (
                    <CommandShortcut>
                      {action.shortcuts.join('+')}
                    </CommandShortcut>
                  )}
                </CommandItem>
              ))
            }
          </CommandGroup>
          
          <CommandGroup heading="Recent Items">
            {sortedRecentItems.slice(0, 3).map(item => (
              <CommandItem
                key={item.id}
                onSelect={() => {
                  setIsCommandOpen(false);
                  window.location.href = item.path;
                }}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {item.type}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
      
      <div className="mb-6">
        <Card className="border-dashed bg-background/70">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={commandInputRef}
                placeholder="Search actions, workflows, and more..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="mb-8"
      >
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="quickActions">Quick Actions</TabsTrigger>
          <TabsTrigger value="recents">Recent Activity</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        
        {/* Quick Actions Tab */}
        <TabsContent value="quickActions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pinned Actions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  Pinned Actions
                </CardTitle>
                <CardDescription>
                  Your most frequently used actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {pinnedActions.length === 0 ? (
                    <div className="col-span-2 text-center py-8 text-muted-foreground">
                      <p>No pinned actions yet</p>
                      <p className="text-sm mt-1">Pin your favorite actions for quick access</p>
                    </div>
                  ) : (
                    pinnedActions.map(action => (
                      <ContextMenu key={action.id}>
                        <ContextMenuTrigger>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => handleExecuteAction(action)}
                            asChild={!!action.path}
                          >
                            {action.path ? (
                              <Link to={action.path}>
                                {action.icon}
                                <span className="ml-2 truncate">{action.name}</span>
                              </Link>
                            ) : (
                              <>
                                {action.icon}
                                <span className="ml-2 truncate">{action.name}</span>
                              </>
                            )}
                          </Button>
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-48">
                          <ContextMenuItem onClick={() => pinAction(action)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove from Pins
                          </ContextMenuItem>
                          {isCreatingWorkflow && (
                            <ContextMenuItem onClick={() => addWorkflowStep(action)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add to Workflow
                            </ContextMenuItem>
                          )}
                        </ContextMenuContent>
                      </ContextMenu>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Categories */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Grid2X2 className="h-5 w-5" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <Button variant="outline" className="h-auto flex flex-col p-4 items-center justify-center gap-3">
                      <CheckSquare className="h-8 w-8 text-blue-500" />
                      <span>Tasks</span>
                    </Button>
                    <Button variant="outline" className="h-auto flex flex-col p-4 items-center justify-center gap-3">
                      <FileText className="h-8 w-8 text-purple-500" />
                      <span>Notes</span>
                    </Button>
                    <Button variant="outline" className="h-auto flex flex-col p-4 items-center justify-center gap-3">
                      <Calendar className="h-8 w-8 text-red-500" />
                      <span>Calendar</span>
                    </Button>
                    <Button variant="outline" className="h-auto flex flex-col p-4 items-center justify-center gap-3">
                      <Folder className="h-8 w-8 text-amber-500" />
                      <span>Projects</span>
                    </Button>
                    <Button variant="outline" className="h-auto flex flex-col p-4 items-center justify-center gap-3">
                      <Focus className="h-8 w-8 text-green-500" />
                      <span>Focus</span>
                    </Button>
                    <Button variant="outline" className="h-auto flex flex-col p-4 items-center justify-center gap-3">
                      <BarChart2 className="h-8 w-8 text-sky-500" />
                      <span>Analytics</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Create Workflow Button */}
              {!isCreatingWorkflow ? (
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setIsCreatingWorkflow(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Workflow
                </Button>
              ) : (
                <Button 
                  className="w-full" 
                  variant="default"
                  onClick={() => setIsCreatingWorkflow(false)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel Workflow Creation
                </Button>
              )}
            </div>
          </div>
          
          {/* All Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>All Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="navigation">Navigation</TabsTrigger>
                  <TabsTrigger value="task">Task</TabsTrigger>
                  <TabsTrigger value="productivity">Productivity</TabsTrigger>
                  <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredActions.map(action => {
                    const isPinned = pinnedActions.some(a => a.id === action.id);
                    
                    return (
                      <ContextMenu key={action.id}>
                        <ContextMenuTrigger>
                          <Card 
                            className={`cursor-pointer hover:border-primary/50 transition-colors ${
                              isPinned ? "border-primary/40 bg-primary/5" : ""
                            }`}
                            onClick={() => handleExecuteAction(action)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                {action.icon}
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium">{action.name}</h4>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {action.description}
                                  </p>
                                </div>
                                {isPinned && (
                                  <Star className="h-4 w-4 text-amber-500 flex-shrink-0" />
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-48">
                          <ContextMenuItem onClick={() => pinAction(action)}>
                            {isPinned ? (
                              <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Unpin Action
                              </>
                            ) : (
                              <>
                                <Star className="h-4 w-4 mr-2" />
                                Pin Action
                              </>
                            )}
                          </ContextMenuItem>
                          {action.path && (
                            <ContextMenuItem>
                              <Link to={action.path} className="flex items-center w-full">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open in New Tab
                              </Link>
                            </ContextMenuItem>
                          )}
                          {isCreatingWorkflow && (
                            <ContextMenuItem onClick={() => addWorkflowStep(action)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add to Workflow
                            </ContextMenuItem>
                          )}
                        </ContextMenuContent>
                      </ContextMenu>
                    );
                  })}
                </div>
              </TabsContent>
            </CardContent>
          </Card>
          
          {/* Workflow Creation Form */}
          {isCreatingWorkflow && (
            <Card className="border-primary border-dashed">
              <CardHeader className="pb-2">
                <CardTitle>Create New Workflow</CardTitle>
                <CardDescription>
                  Combine multiple actions into a single workflow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Workflow Name</label>
                  <Input 
                    placeholder="Enter workflow name" 
                    value={newWorkflow.name}
                    onChange={(e) => setNewWorkflow({...newWorkflow, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description (optional)</label>
                  <Input 
                    placeholder="Enter workflow description" 
                    value={newWorkflow.description}
                    onChange={(e) => setNewWorkflow({...newWorkflow, description: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Steps</label>
                  {currentWorkflowSteps.length === 0 ? (
                    <div className="text-center py-4 border rounded-md border-dashed">
                      <p className="text-muted-foreground">
                        No steps added yet
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Right-click on actions to add them to your workflow
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {currentWorkflowSteps.map((step, index) => (
                        <div 
                          key={step.id}
                          className="flex items-center gap-2 border rounded-md p-2"
                        >
                          <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                            {index + 1}
                          </Badge>
                          <span className="flex-1">{step.description}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => removeWorkflowStep(step.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={addWorkflow}
                  disabled={!newWorkflow.name || currentWorkflowSteps.length === 0}
                >
                  Create Workflow
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        {/* Recent Activity Tab */}
        <TabsContent value="recents" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your recently accessed items and actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sortedRecentItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No recent activity</p>
                  <p className="text-sm mt-1">Your recent items will appear here</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {sortedRecentItems.map(item => (
                    <ContextMenu key={item.id}>
                      <ContextMenuTrigger>
                        <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md">
                          <div className="flex items-center gap-3">
                            {item.icon}
                            <div>
                              <h4 className="text-sm font-medium">{item.name}</h4>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Badge variant="outline" className="text-xs py-0">
                                  {item.type}
                                </Badge>
                                <span>
                                  {new Date(item.lastAccessed).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Link to={item.path}>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent className="w-48">
                        <ContextMenuItem asChild>
                          <Link to={item.path} className="flex items-center w-full">
                            <ArrowRightCircle className="h-4 w-4 mr-2" />
                            Go to {item.name}
                          </Link>
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => removeRecentItem(item.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove from Recents
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Workflows Tab */}
        <TabsContent value="workflows" className="space-y-6">
          {workflows.length === 0 ? (
            <Card>
              <CardContent className="text-center py-10">
                <Layers className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-xl font-medium mt-4 mb-2">No workflows yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Create workflows to combine multiple actions into a single sequence
                </p>
                <Button 
                  onClick={() => {
                    setIsCreatingWorkflow(true);
                    setActiveTab("quickActions");
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Workflow
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workflows.map(workflow => (
                <ContextMenu key={workflow.id}>
                  <ContextMenuTrigger>
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{workflow.name}</CardTitle>
                            {workflow.description && (
                              <CardDescription>{workflow.description}</CardDescription>
                            )}
                          </div>
                          <Menubar className="h-8">
                            <MenubarMenu>
                              <MenubarTrigger className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </MenubarTrigger>
                              <MenubarContent>
                                <MenubarItem onClick={() => togglePinWorkflow(workflow.id)}>
                                  {workflow.pinnedToHome ? (
                                    <>
                                      <StarFilled className="h-4 w-4 mr-2 text-yellow-400" />
                                      Unpin from Home
                                    </>
                                  ) : (
                                    <>
                                      <Star className="h-4 w-4 mr-2" />
                                      Pin to Home
                                    </>
                                  )}
                                </MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem onClick={() => removeWorkflow(workflow.id)}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Workflow
                                </MenubarItem>
                              </MenubarContent>
                            </MenubarMenu>
                          </Menubar>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {workflow.steps.map((step, index) => (
                            <div 
                              key={step.id}
                              className="flex items-center gap-2"
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className={`h-7 w-7 ${
                                  step.completed ? "bg-primary/10 text-primary" : "bg-muted"
                                }`}
                                onClick={() => toggleWorkflowStepCompletion(workflow.id, step.id)}
                              >
                                {step.completed ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <span className="text-xs">{index + 1}</span>
                                )}
                              </Button>
                              <div className="flex-1 flex items-center gap-1">
                                <span className={step.completed ? "text-muted-foreground line-through" : ""}>
                                  {step.description}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          disabled={workflow.steps.every(step => step.completed)}
                        >
                          {workflow.steps.every(step => step.completed) ? (
                            <>
                              <FileCheck className="h-4 w-4 mr-2" />
                              Complete
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Run Workflow
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-48">
                    <ContextMenuItem onClick={() => togglePinWorkflow(workflow.id)}>
                      {workflow.pinnedToHome ? (
                        <>
                          <StarFilled className="h-4 w-4 mr-2 text-yellow-400" />
                          Unpin from Home
                        </>
                      ) : (
                        <>
                          <Star className="h-4 w-4 mr-2" />
                          Pin to Home
                        </>
                      )}
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => removeWorkflow(workflow.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Workflow
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Favorites Tab */}
        <TabsContent value="favorites" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Favorites</CardTitle>
              <CardDescription>
                Your pinned actions and workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Pinned Actions */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Pinned Actions
                  </h3>
                  
                  {pinnedActions.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground border rounded-md border-dashed">
                      <p>No pinned actions</p>
                      <p className="text-xs mt-1">
                        Pin actions from the Quick Actions tab
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {pinnedActions.map(action => (
                        <Button
                          key={action.id}
                          variant="outline"
                          className="justify-start"
                          onClick={() => handleExecuteAction(action)}
                          asChild={!!action.path}
                        >
                          {action.path ? (
                            <Link to={action.path}>
                              {action.icon}
                              <span className="ml-2">{action.name}</span>
                            </Link>
                          ) : (
                            <>
                              {action.icon}
                              <span className="ml-2">{action.name}</span>
                            </>
                          )}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
                
                <Separator />
                
                {/* Pinned Workflows */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Pinned Workflows
                  </h3>
                  
                  {workflows.filter(w => w.pinnedToHome).length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground border rounded-md border-dashed">
                      <p>No pinned workflows</p>
                      <p className="text-xs mt-1">
                        Pin workflows from the Workflows tab
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {workflows
                        .filter(w => w.pinnedToHome)
                        .map(workflow => (
                          <Card key={workflow.id} className="bg-secondary/10">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium">{workflow.name}</h4>
                                <StarFilled className="h-4 w-4 text-yellow-400" />
                              </div>
                              {workflow.description && (
                                <p className="text-sm text-muted-foreground mb-3">
                                  {workflow.description}
                                </p>
                              )}
                              <Progress 
                                value={
                                  (workflow.steps.filter(s => s.completed).length / 
                                  workflow.steps.length) * 100
                                }
                                className="h-1 mb-2"
                              />
                              <div className="flex justify-between items-center text-xs text-muted-foreground">
                                <span>
                                  {workflow.steps.filter(s => s.completed).length} of {workflow.steps.length} steps
                                </span>
                                <span>
                                  {Math.round((workflow.steps.filter(s => s.completed).length / 
                                    workflow.steps.length) * 100)}%
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      }
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Default quick actions
const defaultQuickActions: QuickAction[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Return to main dashboard",
    icon: <Home className="h-4 w-4" />,
    path: "/",
    shortcuts: ["Alt", "H"],
    category: 'navigation',
    pinned: true,
  },
  {
    id: "add-task",
    name: "New Task",
    description: "Add a new task",
    icon: <CheckSquare className="h-4 w-4" />,
    path: "/tasks",
    shortcuts: ["Alt", "T"],
    category: 'task',
    pinned: true,
  },
  {
    id: "calendar",
    name: "Calendar",
    description: "View your calendar",
    icon: <Calendar className="h-4 w-4" />,
    path: "/calendar",
    shortcuts: ["Alt", "C"],
    category: 'calendar',
  },
  {
    id: "time-tracking",
    name: "Time Tracking",
    description: "Track your time",
    icon: <Clock className="h-4 w-4" />,
    path: "/time-tracking",
    category: 'navigation',
  },
  {
    id: "focus-mode",
    name: "Focus Mode",
    description: "Enter distraction-free mode",
    icon: <Focus className="h-4 w-4" />,
    path: "/focus",
    shortcuts: ["Alt", "F"],
    category: 'navigation',
    pinned: true,
  },
  {
    id: "notes",
    name: "Notes",
    description: "View your notes",
    icon: <FileText className="h-4 w-4" />,
    path: "/notes",
    category: 'note',
  },
  {
    id: "profile",
    name: "Profile",
    description: "View your profile",
    icon: <UserCircle className="h-4 w-4" />,
    path: "/profile",
    category: 'navigation',
  },
  {
    id: "settings",
    name: "Settings",
    description: "Change app settings",
    icon: <Settings className="h-4 w-4" />,
    path: "/settings",
    category: 'system',
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "View your productivity analytics",
    icon: <BarChart2 className="h-4 w-4" />,
    path: "/analytics",
    category: 'navigation',
  },
  {
    id: "habits",
    name: "Habits",
    description: "Track your habits",
    icon: <Activity className="h-4 w-4" />,
    path: "/habits",
    category: 'task',
  },
  {
    id: "projects",
    name: "Projects",
    description: "Manage your projects",
    icon: <Folder className="h-4 w-4" />,
    path: "/projects",
    category: 'navigation',
  },
  {
    id: "calculator",
    name: "Calculator",
    description: "Quick calculations",
    icon: <Calculator className="h-4 w-4" />,
    action: () => {
      window.open('https://www.calculator.net/', '_blank');
    },
    category: 'system',
  },
  {
    id: "terminal",
    name: "Command Line",
    description: "Advanced system tools",
    icon: <Terminal className="h-4 w-4" />,
    action: () => {
      alert('Command Line Interface would open here');
    },
    category: 'system',
  },
  {
    id: "kanban",
    name: "Kanban Board",
    description: "Visual task management",
    icon: <Trello className="h-4 w-4" />,
    action: () => {
      alert('Kanban Board would open here');
    },
    category: 'task',
  },
  {
    id: "quick-note",
    name: "Quick Note",
    description: "Jot down a quick note",
    icon: <Edit className="h-4 w-4" />,
    action: () => {
      alert('Quick Note feature would open here');
    },
    category: 'note',
  }
];

// Default recent items
const defaultRecentItems: RecentItem[] = [
  {
    id: "recent-dashboard",
    name: "Dashboard",
    type: "dashboard",
    icon: <Home className="h-4 w-4" />,
    path: "/",
    lastAccessed: new Date().toISOString(),
  },
  {
    id: "recent-tasks",
    name: "Tasks",
    type: "task",
    icon: <CheckSquare className="h-4 w-4" />,
    path: "/tasks",
    lastAccessed: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "recent-focus",
    name: "Focus Mode",
    type: "dashboard",
    icon: <Focus className="h-4 w-4" />,
    path: "/focus",
    lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];

// Default workflows
const defaultWorkflows: Workflow[] = [
  {
    id: "morning-routine",
    name: "Morning Routine",
    description: "Start your day right with this workflow",
    pinnedToHome: true,
    steps: [
      {
        id: "check-calendar",
        description: "Check today's calendar",
        path: "/calendar",
        completed: false,
      },
      {
        id: "review-tasks",
        description: "Review pending tasks",
        path: "/tasks",
        completed: false,
      },
      {
        id: "start-focus",
        description: "Start focus session",
        path: "/focus",
        completed: false,
      }
    ]
  }
];
