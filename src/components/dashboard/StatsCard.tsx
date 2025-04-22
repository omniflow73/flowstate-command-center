
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Award, TrendingUp, Target } from "lucide-react";

export default function StatsCard() {
  const stats = [
    {
      id: "1",
      title: "Tasks Completed",
      value: "18",
      change: "+4",
      icon: CheckCircle2,
      iconColor: "text-green-500",
    },
    {
      id: "2",
      title: "Current Streak",
      value: "7",
      unit: "days",
      icon: Award,
      iconColor: "text-primary",
    },
    {
      id: "3",
      title: "Productivity",
      value: "85",
      unit: "%",
      change: "+12%",
      icon: TrendingUp,
      iconColor: "text-blue-500",
    },
    {
      id: "4",
      title: "Goals Reached",
      value: "3",
      unit: "/5",
      icon: Target,
      iconColor: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.id} className="glass-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className={`rounded-full p-3 bg-white/10 dark:bg-white/5 ${stat.iconColor}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-2xl font-bold">
                  {stat.value}
                  <span className="text-sm font-normal">{stat.unit}</span>
                </h3>
                {stat.change && (
                  <span className="text-xs font-medium text-green-500">
                    {stat.change}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
