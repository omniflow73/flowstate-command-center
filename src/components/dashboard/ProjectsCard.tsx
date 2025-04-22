
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";

type Project = {
  id: string;
  name: string;
  category: string;
  progress: number;
  dueDate: string;
};

export default function ProjectsCard() {
  const projects: Project[] = [
    {
      id: "1",
      name: "Website Redesign",
      category: "Design",
      progress: 75,
      dueDate: "May 28",
    },
    {
      id: "2",
      name: "Marketing Campaign",
      category: "Marketing",
      progress: 40,
      dueDate: "Jun 15",
    },
    {
      id: "3",
      name: "Product Launch",
      category: "Business",
      progress: 20,
      dueDate: "Jul 10",
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Design": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Marketing": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Business": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default: return "";
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle>Projects</CardTitle>
        <ArrowRight className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium">{project.name}</span>
                  <Badge 
                    className={`inline-flex w-fit ${getCategoryColor(project.category)}`}
                    variant="outline"
                  >
                    {project.category}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">{project.dueDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={project.progress} className="h-2" />
                <span className="text-sm font-medium">{project.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
