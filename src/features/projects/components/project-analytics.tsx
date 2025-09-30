"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target,
  Calendar,
  Users
} from "lucide-react";
import { Project } from "../types";
import { Task, TaskStatus, TaskPriority } from "@/features/tasks/types";
import { format, subDays, eachDayOfInterval } from "date-fns";

interface ProjectAnalyticsProps {
  project: Project;
  tasks: Task[];
  isLoading?: boolean;
}

export const ProjectAnalytics = ({ project, tasks, isLoading }: ProjectAnalyticsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-32 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate analytics data
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === TaskStatus.DONE).length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Task status distribution
  const statusDistribution = {
    [TaskStatus.TODO]: tasks.filter(t => t.status === TaskStatus.TODO).length,
    [TaskStatus.IN_PROGRESS]: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
    [TaskStatus.IN_REVIEW]: tasks.filter(t => t.status === TaskStatus.IN_REVIEW).length,
    [TaskStatus.DONE]: tasks.filter(t => t.status === TaskStatus.DONE).length,
  };

  // Priority distribution
  const priorityDistribution = tasks.reduce((acc, task) => {
    if (task.priority) {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
    }
    return acc;
  }, {} as Record<TaskPriority, number>);

  // Calculate estimated vs actual hours
  const totalEstimatedHours = tasks.reduce((acc, task) => acc + (task.estimatedHours || 0), 0);
  const totalLoggedHours = tasks.reduce((acc, task) => acc + (task.loggedHours || 0), 0);

  // Get overdue tasks
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.status === TaskStatus.DONE) return false;
    return new Date(task.dueDate) < new Date();
  });

  // Tasks completed in last 7 days
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  });

  const tasksCompletedLast7Days = last7Days.map(day => {
    const dayTasks = tasks.filter(task => {
      if (task.status !== TaskStatus.DONE) return false;
      const updatedDate = new Date(task.$updatedAt);
      return format(updatedDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });
    return {
      date: format(day, 'MMM dd'),
      count: dayTasks.length
    };
  });

  // Team productivity (tasks per assignee)
  const assigneeProductivity = tasks.reduce((acc, task) => {
    const assigneeKey = task.assignee ? task.assignee.$id : 'unassigned';
    const assigneeName = task.assignee ? task.assignee.name : 'Unassigned';
    if (!acc[assigneeKey]) {
      acc[assigneeKey] = { total: 0, completed: 0, name: assigneeName };
    }
    acc[assigneeKey].total += 1;
    if (task.status === TaskStatus.DONE) {
      acc[assigneeKey].completed += 1;
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number; name: string }>);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{Math.round(completionRate)}%</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <Progress value={completionRate} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Estimated Hours</p>
                <p className="text-2xl font-bold">{totalEstimatedHours}h</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Logged Hours</p>
                <p className="text-2xl font-bold">{totalLoggedHours}h</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue Tasks</p>
                <p className="text-2xl font-bold text-red-600">{overdueTasks.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Task Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(statusDistribution).map(([status, count]) => {
                const percentage = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
                const statusColors = {
                  [TaskStatus.TODO]: 'bg-gray-500',
                  [TaskStatus.IN_PROGRESS]: 'bg-blue-500',
                  [TaskStatus.IN_REVIEW]: 'bg-yellow-500',
                  [TaskStatus.DONE]: 'bg-green-500',
                };
                
                return (
                  <div key={status} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{status.replace('_', ' ')}</span>
                      <span className="text-sm text-muted-foreground">{count} tasks</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${statusColors[status as TaskStatus]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(priorityDistribution).map(([priority, count]) => (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className={
                        priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                        priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                        priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }
                    >
                      {priority}
                    </Badge>
                  </div>
                  <span className="font-medium">{count} tasks</span>
                </div>
              ))}
              {Object.keys(priorityDistribution).length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No priority data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks Completed (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasksCompletedLast7Days.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{day.date}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ 
                          width: `${day.count > 0 ? Math.max((day.count / Math.max(...tasksCompletedLast7Days.map(d => d.count), 1)) * 100, 10) : 0}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{day.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Productivity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Productivity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(assigneeProductivity).map(([assigneeId, stats]) => {
                const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
                return (
                  <div key={assigneeId} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {stats.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {stats.completed}/{stats.total} tasks
                      </span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                  </div>
                );
              })}
              {Object.keys(assigneeProductivity).length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No team data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Tasks Alert */}
      {overdueTasks.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Overdue Tasks Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueTasks.slice(0, 5).map((task) => (
                <div key={task.$id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="font-medium">{task.name}</span>
                  <Badge variant="destructive">
                    Due: {task.dueDate ? format(new Date(task.dueDate), 'MMM dd') : 'No date'}
                  </Badge>
                </div>
              ))}
              {overdueTasks.length > 5 && (
                <p className="text-sm text-red-700 text-center">
                  +{overdueTasks.length - 5} more overdue tasks
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};