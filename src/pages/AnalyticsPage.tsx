
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart2, LineChart, PieChart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart as ReLineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AnalyticsPage() {
  const navigate = useNavigate();
  
  // Sample data for charts
  const taskCompletionData = [
    { name: "Mon", completed: 5, total: 8 },
    { name: "Tue", completed: 7, total: 10 },
    { name: "Wed", completed: 4, total: 6 },
    { name: "Thu", completed: 8, total: 9 },
    { name: "Fri", completed: 6, total: 12 },
    { name: "Sat", completed: 3, total: 5 },
    { name: "Sun", completed: 5, total: 7 },
  ];
  
  const productivityTrendData = [
    { date: "Week 1", productivity: 65 },
    { date: "Week 2", productivity: 72 },
    { date: "Week 3", productivity: 68 },
    { date: "Week 4", productivity: 85 },
    { date: "Week 5", productivity: 80 },
  ];
  
  const habitCompletionData = [
    { name: "Exercise", value: 75 },
    { name: "Reading", value: 60 },
    { name: "Meditation", value: 85 },
    { name: "Water", value: 90 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  return (
    <div className="container max-w-6xl mx-auto p-4 space-y-8 min-h-screen">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Track your productivity and progress over time.
        </p>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span>Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="productivity" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>Productivity</span>
          </TabsTrigger>
          <TabsTrigger value="habits" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span>Habits</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={taskCompletionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" name="Completed Tasks" fill="#8884d8" />
                    <Bar dataKey="total" name="Total Tasks" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="productivity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Productivity Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart
                    data={productivityTrendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="productivity" 
                      name="Productivity Score" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }}
                      strokeWidth={2} 
                    />
                  </ReLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="habits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Habit Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={habitCompletionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {habitCompletionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Calendar Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mb-4">
            <Calendar className="h-4 w-4" />
            <span>Last updated: Today at 10:30 AM</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="border rounded-lg p-4">
              <p className="text-muted-foreground text-sm mb-1">Most Productive Day</p>
              <p className="text-2xl font-bold">Thursday</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-muted-foreground text-sm mb-1">Weekly Completion Rate</p>
              <p className="text-2xl font-bold">76%</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-muted-foreground text-sm mb-1">Monthly Goals Progress</p>
              <p className="text-2xl font-bold">62%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
