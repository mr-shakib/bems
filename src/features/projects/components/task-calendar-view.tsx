"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";
import { Task, TaskStatus } from "@/features/tasks/types";

interface TaskCalendarViewProps {
  tasks: Task[];
  isLoading: boolean;
  searchTerm: string;
  statusFilter: string;
  assigneeFilter: string;
  dueDateFilter: string;
  workspaceId: string;
  projectId: string;
}

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.TODO:
      return "bg-gray-100 text-gray-800";
    case TaskStatus.IN_PROGRESS:
      return "bg-blue-100 text-blue-800";
    case TaskStatus.IN_REVIEW:
      return "bg-yellow-100 text-yellow-800";
    case TaskStatus.DONE:
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const TaskCalendarView = ({
  tasks,
  isLoading,
  searchTerm,
  statusFilter,
  assigneeFilter,
}: TaskCalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Only show tasks with due dates
      if (!task.dueDate) return false;

      // Search filter
      if (searchTerm && !task.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all" && task.status !== statusFilter) {
        return false;
      }

      // Assignee filter (simplified for now)
      if (assigneeFilter !== "all") {
        // This would need to be implemented with actual assignee data
      }

      return true;
    });
  }, [tasks, searchTerm, statusFilter, assigneeFilter]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDay = (day: Date) => {
    return filteredTasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), day)
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="mx-auto w-8 h-8 bg-gradient-to-r from-transparent via-slate-400 to-transparent animate-shimmer rounded-full" style={{ backgroundSize: '200% 100%' }}></div>
        <p className="mt-2 text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <h3 className="text-lg font-semibold">
            {format(currentDate, "MMMM yyyy")}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-4">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {monthDays.map(day => {
              const dayTasks = getTasksForDay(day);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toISOString()}
                  className={`
                    min-h-[100px] p-2 border rounded-lg space-y-1
                    ${isToday ? 'bg-blue-50 border-blue-200' : 'bg-background border-border'}
                    hover:bg-muted/50 transition-colors
                  `}
                >
                  <div className={`
                    text-sm font-medium mb-1
                    ${isToday ? 'text-blue-600' : 'text-foreground'}
                  `}>
                    {format(day, 'd')}
                  </div>
                  
                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map(task => (
                      <div
                        key={task.$id}
                        className="text-xs p-1 rounded cursor-pointer hover:opacity-80"
                        title={task.name}
                      >
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(task.status)} text-xs p-1 w-full justify-start truncate`}
                        >
                          {task.name}
                        </Badge>
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{dayTasks.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tasks without due dates */}
      {filteredTasks.filter(task => !task.dueDate).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tasks without due dates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredTasks.filter(task => !task.dueDate).map(task => (
                <div key={task.$id} className="flex items-center gap-2 p-2 border rounded-lg">
                  <Badge variant="outline" className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                  <span className="flex-1 truncate">{task.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};