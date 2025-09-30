"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Target
} from "lucide-react";
import { Project } from "../types";
import { Task, TaskStatus } from "@/features/tasks/types";
import { format, parseISO, isBefore, isAfter, addDays } from "date-fns";

interface ProjectTimelineProps {
  project: Project;
  tasks: Task[];
}

export const ProjectTimeline = ({ project, tasks }: ProjectTimelineProps) => {
  // Sort tasks by due date
  const tasksWithDates = tasks
    .filter(task => task.dueDate)
    .sort((a, b) => {
      const dateA = new Date(a.dueDate!);
      const dateB = new Date(b.dueDate!);
      return dateA.getTime() - dateB.getTime();
    });

  // Group tasks by month
  const tasksByMonth = tasksWithDates.reduce((acc, task) => {
    const month = format(new Date(task.dueDate!), 'yyyy-MM');
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  // Calculate project milestones
  const milestones = [
    {
      id: 'start',
      title: 'Project Started',
      date: project.$createdAt,
      type: 'start',
      completed: true
    },
    {
      id: 'quarter',
      title: '25% Complete',
      date: addDays(new Date(project.$createdAt), 30).toISOString(),
      type: 'milestone',
      completed: tasks.filter(t => t.status === TaskStatus.DONE).length >= tasks.length * 0.25
    },
    {
      id: 'half',
      title: '50% Complete',
      date: addDays(new Date(project.$createdAt), 60).toISOString(),
      type: 'milestone',
      completed: tasks.filter(t => t.status === TaskStatus.DONE).length >= tasks.length * 0.50
    },
    {
      id: 'finish',
      title: 'Project Complete',
      date: tasksWithDates.length > 0 ? tasksWithDates[tasksWithDates.length - 1].dueDate! : addDays(new Date(project.$createdAt), 90).toISOString(),
      type: 'end',
      completed: tasks.length > 0 && tasks.every(t => t.status === TaskStatus.DONE)
    }
  ];

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DONE:
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case TaskStatus.IN_PROGRESS:
        return <Clock className="h-4 w-4 text-blue-600" />;
      case TaskStatus.IN_REVIEW:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DONE:
        return 'bg-green-100 text-green-800 border-green-200';
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case TaskStatus.IN_REVIEW:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isOverdue = (dueDate: string, status: TaskStatus) => {
    return status !== TaskStatus.DONE && isBefore(new Date(dueDate), new Date());
  };

  return (
    <div className="space-y-6">
      {/* Project Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Project Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  milestone.completed 
                    ? 'bg-green-500 border-green-500' 
                    : 'bg-white border-gray-300'
                }`}>
                  {milestone.completed && (
                    <CheckCircle2 className="h-3 w-3 text-white m-0.5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${
                      milestone.completed ? 'text-green-800' : 'text-gray-900'
                    }`}>
                      {milestone.title}
                    </h4>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(milestone.date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  {milestone.completed && (
                    <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800">
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Task Timeline
            </CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {Object.keys(tasksByMonth).length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Scheduled Tasks</h3>
              <p className="text-gray-600">
                Tasks with due dates will appear here in chronological order.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(tasksByMonth).map(([month, monthTasks]) => (
                <div key={month} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {format(parseISO(month + '-01'), 'MMMM yyyy')}
                    </h3>
                    <div className="flex-1 h-px bg-gray-200" />
                    <Badge variant="secondary">
                      {monthTasks.length} tasks
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {monthTasks.map((task) => (
                      <div
                        key={task.$id}
                        className={`p-4 rounded-lg border transition-all hover:shadow-sm ${
                          isOverdue(task.dueDate!, task.status)
                            ? 'border-red-200 bg-red-50'
                            : getStatusColor(task.status)
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {getStatusIcon(task.status)}
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-1">
                                {task.name}
                              </h4>
                              {task.description && (
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                  {task.description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1 text-gray-500">
                                  <Calendar className="h-3 w-3" />
                                  Due: {format(new Date(task.dueDate!), 'MMM dd, yyyy')}
                                </div>
                                {task.estimatedHours && (
                                  <div className="flex items-center gap-1 text-gray-500">
                                    <Clock className="h-3 w-3" />
                                    {task.estimatedHours}h estimated
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <Badge 
                              variant="outline" 
                              className={
                                task.status === TaskStatus.DONE ? 'border-green-300 text-green-700' :
                                task.status === TaskStatus.IN_PROGRESS ? 'border-blue-300 text-blue-700' :
                                task.status === TaskStatus.IN_REVIEW ? 'border-yellow-300 text-yellow-700' :
                                'border-gray-300 text-gray-700'
                              }
                            >
                              {task.status.replace('_', ' ')}
                            </Badge>
                            
                            {isOverdue(task.dueDate!, task.status) && (
                              <Badge variant="destructive" className="text-xs">
                                Overdue
                              </Badge>
                            )}
                            
                            {task.priority && (
                              <Badge 
                                variant="secondary" 
                                className={
                                  task.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                                  task.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                                  task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }
                              >
                                {task.priority}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};