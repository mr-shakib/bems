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
  Users,
  AlertTriangle,
  CheckCircle,
  Activity
} from "lucide-react";
import { Task, TaskStatus } from "../types";
import { format, subDays, eachDayOfInterval, isToday, isYesterday } from "date-fns";

interface TaskAnalyticsProps {
  tasks: Task[];
  isLoading?: boolean;
}

export const TaskAnalytics = ({ tasks, isLoading }: TaskAnalyticsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate analytics data
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === TaskStatus.DONE).length;
  const inProgressTasks = tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;
  const todoTasks = tasks.filter(task => task.status === TaskStatus.TODO).length;
  const reviewTasks = tasks.filter(task => task.status === TaskStatus.IN_REVIEW).length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Get overdue tasks
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.status === TaskStatus.DONE) return false;
    return new Date(task.dueDate) < new Date();
  });

  // Get due today tasks
  const dueTodayTasks = tasks.filter(task => {
    if (!task.dueDate || task.status === TaskStatus.DONE) return false;
    return isToday(new Date(task.dueDate));
  });

  // Calculate estimated vs actual hours
  const totalEstimatedHours = tasks.reduce((acc, task) => acc + (task.estimatedHours || 0), 0);
  const totalLoggedHours = tasks.reduce((acc, task) => acc + (task.loggedHours || 0), 0);

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
      count: dayTasks.length,
      isToday: isToday(day),
      isYesterday: isYesterday(day)
    };
  });

  const recentCompletedTasks = tasksCompletedLast7Days.reduce((acc, day) => acc + day.count, 0);

  // Task status distribution
  const statusDistribution = {
    [TaskStatus.TODO]: todoTasks,
    [TaskStatus.IN_PROGRESS]: inProgressTasks,
    [TaskStatus.IN_REVIEW]: reviewTasks,
    [TaskStatus.DONE]: completedTasks,
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(completionRate)}%</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <Target className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <Progress value={completionRate} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{completedTasks} completed</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Due Today</p>
                <p className="text-2xl font-bold text-orange-600">{dueTodayTasks.length}</p>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{overdueTasks.length}</p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Need immediate action</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-gray-600" />
              Task Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(statusDistribution).map(([status, count]) => {
                const percentage = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
                const statusColors = {
                  [TaskStatus.BACKLOG]: { bg: 'bg-red-200', text: 'text-red-700', label: 'Backlog' },
                  [TaskStatus.TODO]: { bg: 'bg-gray-200', text: 'text-gray-700', label: 'To Do' },
                  [TaskStatus.IN_PROGRESS]: { bg: 'bg-blue-200', text: 'text-blue-700', label: 'In Progress' },
                  [TaskStatus.IN_REVIEW]: { bg: 'bg-yellow-200', text: 'text-yellow-700', label: 'In Review' },
                  [TaskStatus.DONE]: { bg: 'bg-green-200', text: 'text-green-700', label: 'Done' },
                };
                
                const colorConfig = statusColors[status as TaskStatus];
                
                return (
                  <div key={status} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{colorConfig.label}</span>
                      <span className="text-sm text-gray-500">{count} tasks ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${colorConfig.bg.replace('200', '500')}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gray-600" />
              Recent Activity (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-700">Tasks Completed</span>
                <span className="text-lg font-bold text-green-700">{recentCompletedTasks}</span>
              </div>
              
              <div className="space-y-2">
                {tasksCompletedLast7Days.map((day, index) => (
                  <div key={index} className="flex items-center justify-between py-1">
                    <span className={`text-sm ${day.isToday ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                      {day.isToday ? 'Today' : day.isYesterday ? 'Yesterday' : day.date}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-100 rounded-full h-1.5">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${day.count > 0 ? Math.max((day.count / Math.max(...tasksCompletedLast7Days.map(d => d.count), 1)) * 100, 8) : 0}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-6 text-right text-gray-700">{day.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Productivity */}
        {Object.keys(assigneeProductivity).length > 0 && (
          <Card className="border border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-600" />
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
                        <span className="text-sm font-medium text-gray-700">{stats.name}</span>
                        <span className="text-sm text-gray-500">
                          {stats.completed}/{stats.total} ({Math.round(completionRate)}%)
                        </span>
                      </div>
                      <Progress value={completionRate} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Time Tracking */}
        {(totalEstimatedHours > 0 || totalLoggedHours > 0) && (
          <Card className="border border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-600" />
                Time Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-700">Estimated Hours</span>
                  <span className="text-lg font-bold text-blue-700">{totalEstimatedHours}h</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium text-purple-700">Logged Hours</span>
                  <span className="text-lg font-bold text-purple-700">{totalLoggedHours}h</span>
                </div>
                {totalEstimatedHours > 0 && (
                  <div className="pt-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round((totalLoggedHours / totalEstimatedHours) * 100)}%</span>
                    </div>
                    <Progress 
                      value={(totalLoggedHours / totalEstimatedHours) * 100} 
                      className="h-2" 
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};