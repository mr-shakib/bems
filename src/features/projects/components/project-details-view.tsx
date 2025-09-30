"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectAvatar } from "./project-avatar";
// Temporarily disable these imports due to module resolution issues
// import { ProjectAnalytics } from "./project-analytics";
// import { ProjectTimeline } from "./project-timeline";
// import { ProjectTeam } from "./project-team";
// import { ProjectTasksView } from "./project-tasks-view";
import { 
  PencilIcon, 
  Users, 
  Calendar, 
  BarChart3, 
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Settings
} from "lucide-react";
import Link from "next/link";
import { Project } from "../types";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { TaskStatus } from "@/features/tasks/types";

interface ProjectDetailsViewProps {
  project: Project;
  workspaceId: string;
}

export const ProjectDetailsView = ({ project, workspaceId }: ProjectDetailsViewProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch all tasks for this project
  const { data: tasks, isLoading: tasksLoading } = useGetTasks({
    workspaceId,
    projectId: project.$id,
  });

  const allTasks = tasks?.documents || [];
  
  // Calculate project statistics
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(task => task.status === TaskStatus.DONE).length;
  const inProgressTasks = allTasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;
  const todoTasks = allTasks.filter(task => task.status === TaskStatus.TODO).length;
  const reviewTasks = allTasks.filter(task => task.status === TaskStatus.IN_REVIEW).length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Get overdue tasks (simple check for demonstration)
  const overdueTasks = allTasks.filter(task => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date() && task.status !== TaskStatus.DONE;
  }).length;

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Project Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-12"
            fallbackClassName="text-lg"
          />
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">
              Project Overview & Management
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/workspaces/${workspaceId}/projects/${project.$id}/settings`}>
              <Settings className="size-4 mr-2" />
              Project Settings
            </Link>
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <Link href={`/workspaces/${workspaceId}/projects/${project.$id}/settings`}>
              <PencilIcon className="size-4 mr-2"/>
              Edit Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{totalTasks}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{inProgressTasks}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{overdueTasks}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Project Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Overall Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Completion</span>
                <span>{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="text-center">
                <Badge variant="secondary" className="bg-gray-100 text-gray-800 mb-2">
                  To Do
                </Badge>
                <p className="text-2xl font-bold">{todoTasks}</p>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 mb-2">
                  In Progress
                </Badge>
                <p className="text-2xl font-bold">{inProgressTasks}</p>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 mb-2">
                  In Review
                </Badge>
                <p className="text-2xl font-bold">{reviewTasks}</p>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="bg-green-100 text-green-800 mb-2">
                  Done
                </Badge>
                <p className="text-2xl font-bold">{completedTasks}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allTasks.slice(0, 5).map((task) => (
                    <div key={task.$id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        task.status === TaskStatus.DONE ? 'bg-green-500' :
                        task.status === TaskStatus.IN_PROGRESS ? 'bg-blue-500' :
                        task.status === TaskStatus.IN_REVIEW ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{task.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Status: {task.status.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                  ))}
                  {allTasks.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No tasks in this project yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Project Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Team management features coming soon...
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Task management view coming soon...
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allTasks.slice(0, 6).map((task) => (
                    <Card key={task.$id} className="p-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">{task.name}</h4>
                        <Badge 
                          variant="secondary" 
                          className={
                            task.status === TaskStatus.DONE ? 'bg-green-100 text-green-800' :
                            task.status === TaskStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800' :
                            task.status === TaskStatus.IN_REVIEW ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        >
                          {task.status.replace('_', ' ')}
                        </Badge>
                        {task.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
                {allTasks.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No tasks in this project yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{completionRate}%</p>
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{totalTasks}</p>
                    <p className="text-sm text-muted-foreground">Total Tasks</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{overdueTasks}</p>
                    <p className="text-sm text-muted-foreground">Overdue Tasks</p>
                  </div>
                </Card>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Detailed analytics dashboard coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <div>
                    <h4 className="font-medium">Project Started</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(project.$createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {allTasks.filter(task => task.dueDate).slice(0, 5).map((task) => (
                  <div key={task.$id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className={`w-4 h-4 rounded-full ${
                      task.status === TaskStatus.DONE ? 'bg-green-500' :
                      task.status === TaskStatus.IN_PROGRESS ? 'bg-blue-500' :
                      'bg-gray-400'
                    }`}></div>
                    <div className="flex-1">
                      <h4 className="font-medium">{task.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
                {allTasks.filter(task => task.dueDate).length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No tasks with due dates yet
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Enhanced timeline view coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};