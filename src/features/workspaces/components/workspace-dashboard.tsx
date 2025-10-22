"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  Activity,
  Plus,
  ArrowRight,
  FolderOpen,
  ClipboardList,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Link from "next/link";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { Task, TaskStatus } from "@/features/tasks/types";
import { Project } from "@/features/projects/types";
import { TaskAnalytics } from "@/features/tasks/components/task-analytics";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { format, isToday, isYesterday, subDays } from "date-fns";
import { SkeletonWorkspaceDashboard } from "@/components/ui/skeleton";

interface WorkspaceDashboardProps {
  workspaceId: string;
  workspaceName: string;
}

export const WorkspaceDashboard = ({ workspaceId, workspaceName }: WorkspaceDashboardProps) => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch all data
  const { data: tasks, isLoading: tasksLoading } = useGetTasks({ workspaceId });
  const { data: projects, isLoading: projectsLoading } = useGetProjects({ workspaceId });

  const allTasks = tasks?.documents || [];
  const allProjects = projects?.documents || [];

  // Calculate key metrics
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(task => task.status === TaskStatus.DONE).length;
  const inProgressTasks = allTasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;
  const todoTasks = allTasks.filter(task => task.status === TaskStatus.TODO).length;
  const reviewTasks = allTasks.filter(task => task.status === TaskStatus.IN_REVIEW).length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Get overdue tasks
  const overdueTasks = allTasks.filter(task => {
    if (!task.dueDate || task.status === TaskStatus.DONE) return false;
    try {
      return new Date(task.dueDate) < new Date();
    } catch {
      return false;
    }
  });

  // Get recent tasks (last 7 days)
  const recentTasks = allTasks
    .filter(task => {
      const createdAt = new Date(task.$createdAt);
      const weekAgo = subDays(new Date(), 7);
      return createdAt >= weekAgo;
    })
    .sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime())
    .slice(0, 5);

  // Get active projects (projects with recent activity)
  const activeProjects = allProjects
    .map(project => {
      const projectTasks = allTasks.filter(task => task.projectId === project.$id);
      const recentActivity = projectTasks.filter(task => {
        const updatedAt = new Date(task.$updatedAt);
        const weekAgo = subDays(new Date(), 7);
        return updatedAt >= weekAgo;
      });
      return {
        ...(project as Project),
        taskCount: projectTasks.length,
        recentActivity: recentActivity.length,
        completionRate: projectTasks.length > 0 
          ? (projectTasks.filter(task => task.status === TaskStatus.DONE).length / projectTasks.length) * 100 
          : 0
      };
    })
    .sort((a, b) => b.recentActivity - a.recentActivity)
    .slice(0, 6);

  if (tasksLoading || projectsLoading) {
    return <SkeletonWorkspaceDashboard />;
  }

  return (
    <div className="h-full flex flex-col space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 animate-slide-in-up">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 transition-all duration-300 ease-out hover:text-primary">
            {workspaceName} Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 transition-all duration-300 ease-out">
            Monitor all of your projects and tasks in one place
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:ml-auto animate-slide-in-right">
          {/* Analytics Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="h-9 px-3 text-sm btn-smooth"
          >
            <BarChart3 className="h-4 w-4 mr-1 transition-transform duration-300 group-hover:scale-110" />
            Analytics
            {showAnalytics ? (
              <ChevronUp className="h-4 w-4 ml-1 transition-transform duration-300" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-1 transition-transform duration-300" />
            )}
          </Button>
          
          <Button asChild className="h-9 px-3 text-sm btn-smooth">
            <Link href={`/workspaces/${workspaceId}/tasks`}>
              <ClipboardList className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
              <span className="hidden sm:inline">View All Tasks</span>
              <span className="sm:hidden">Tasks</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Analytics Section */}
      {showAnalytics && (
        <Card className="border border-gray-200 animate-slide-in-down card-smooth">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6 animate-fade-in">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 animate-bounce-in" />
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Workspace Analytics</h2>
            </div>
            <TaskAnalytics 
              tasks={allTasks} 
              isLoading={tasksLoading}
            />
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="card-smooth animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 transition-transform duration-300 hover:scale-110 hover:rotate-12" />
            </div>
            <p className="text-xl sm:text-2xl font-bold transition-all duration-300 hover:scale-105">{totalTasks}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Total Tasks</p>
          </CardContent>
        </Card>
        
        <Card className="card-smooth animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 transition-transform duration-300 hover:scale-110 hover:rotate-12" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-green-600 transition-all duration-300 hover:scale-105">{completedTasks}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        
        <Card className="card-smooth animate-scale-in" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <FolderOpen className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 transition-transform duration-300 hover:scale-110 hover:rotate-12" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-purple-600 transition-all duration-300 hover:scale-105">{allProjects.length}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Projects</p>
          </CardContent>
        </Card>
        
        <Card className="card-smooth animate-scale-in" style={{ animationDelay: '0.4s' }}>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 transition-transform duration-300 hover:scale-110 hover:rotate-12" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-red-600 transition-all duration-300 hover:scale-105">{overdueTasks.length}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Overdue</p>
          </CardContent>
        </Card>
      </div>

      {/* Completion Progress */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold">Overall Progress</h3>
            <Badge variant="outline" className="text-xs sm:text-sm">
              {completionRate.toFixed(1)}% Complete
            </Badge>
          </div>
          <Progress value={completionRate} className="h-2 sm:h-3" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <p className="text-lg sm:text-xl font-bold text-gray-600">{todoTasks}</p>
              <p className="text-xs text-muted-foreground">To Do</p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl font-bold text-blue-600">{inProgressTasks}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl font-bold text-yellow-600">{reviewTasks}</p>
              <p className="text-xs text-muted-foreground">In Review</p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl font-bold text-green-600">{completedTasks}</p>
              <p className="text-xs text-muted-foreground">Done</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Recent Tasks */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base sm:text-lg">Recent Tasks</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/workspaces/${workspaceId}/tasks`}>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentTasks.length > 0 ? (
                  recentTasks.map((task) => (
                    <div key={task.$id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        task.status === TaskStatus.DONE ? 'bg-green-500' :
                        task.status === TaskStatus.IN_PROGRESS ? 'bg-blue-500' :
                        task.status === TaskStatus.IN_REVIEW ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{task.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {isToday(new Date(task.$createdAt)) ? 'Today' :
                           isYesterday(new Date(task.$createdAt)) ? 'Yesterday' :
                           format(new Date(task.$createdAt), 'MMM dd')}
                        </p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          task.status === TaskStatus.DONE ? 'border-green-200 text-green-700' :
                          task.status === TaskStatus.IN_PROGRESS ? 'border-blue-200 text-blue-700' :
                          task.status === TaskStatus.IN_REVIEW ? 'border-yellow-200 text-yellow-700' :
                          'border-gray-200 text-gray-700'
                        }`}
                      >
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <ClipboardList className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No recent tasks</p>
                    <Button size="sm" className="mt-2" asChild>
                      <Link href={`/workspaces/${workspaceId}/tasks`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Task
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Projects */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base sm:text-lg">Active Projects</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/workspaces/${workspaceId}/projects`}>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeProjects.length > 0 ? (
                  activeProjects.slice(0, 4).map((project) => (
                    <Link 
                      key={project.$id} 
                      href={`/workspaces/${workspaceId}/projects/${project.$id}`}
                      className="block"
                    >
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <ProjectAvatar 
                          image={project.imageUrl} 
                          name={project.name}
                          className="h-8 w-8"
                          fallbackClassName="text-xs"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{project.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-muted-foreground">
                              {project.taskCount} tasks
                            </p>
                            {project.completionRate > 0 && (
                              <>
                                <span className="text-xs text-muted-foreground">•</span>
                                <p className="text-xs text-muted-foreground">
                                  {project.completionRate.toFixed(0)}% complete
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                        {project.recentActivity > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {project.recentActivity} new
                          </Badge>
                        )}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <FolderOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No projects yet</p>
                    <Button size="sm" className="mt-2" asChild>
                      <Link href={`/workspaces/${workspaceId}/projects`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Project
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <div key={task.$id} className="flex items-start gap-3 p-4 border rounded-lg">
                    <div className={`w-3 h-3 rounded-full mt-1 ${
                      task.status === TaskStatus.DONE ? 'bg-green-500' :
                      task.status === TaskStatus.IN_PROGRESS ? 'bg-blue-500' :
                      task.status === TaskStatus.IN_REVIEW ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium">{task.name}</p>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {task.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Created {format(new Date(task.$createdAt), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No recent activity</h3>
                  <p className="text-muted-foreground mt-2">
                    Start creating tasks and projects to see activity here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base sm:text-lg">All Projects</CardTitle>
              <Button size="sm" asChild>
                <Link href={`/workspaces/${workspaceId}/projects`}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {allProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allProjects.map((project) => {
                    const projectTasks = allTasks.filter(task => task.projectId === project.$id);
                    const completedProjectTasks = projectTasks.filter(task => task.status === TaskStatus.DONE).length;
                    const projectCompletionRate = projectTasks.length > 0 
                      ? (completedProjectTasks / projectTasks.length) * 100 
                      : 0;

                    return (
                      <Link 
                        key={project.$id} 
                        href={`/workspaces/${workspaceId}/projects/${project.$id}`}
                        className="block"
                      >
                        <Card className="h-full hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <ProjectAvatar 
                                image={(project as Project).imageUrl} 
                                name={(project as Project).name}
                                className="h-8 w-8"
                                fallbackClassName="text-xs"
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium truncate">{(project as Project).name}</h3>
                                <p className="text-xs text-muted-foreground">
                                  {projectTasks.length} tasks
                                </p>
                              </div>
                            </div>
                            
                            {(project as Project).description && (
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {(project as Project).description}
                              </p>
                            )}
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span>Progress</span>
                                <span>{projectCompletionRate.toFixed(0)}%</span>
                              </div>
                              <Progress value={projectCompletionRate} className="h-1" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No projects yet</h3>
                  <p className="text-muted-foreground mt-2">
                    Create your first project to get started
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href={`/workspaces/${workspaceId}/projects`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Project
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};