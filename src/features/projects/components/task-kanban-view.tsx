"use client";

import { useMemo } from "react";
import { Task, TaskStatus } from "@/features/tasks/types";
import { KanbanBoard } from "@/features/tasks/components/kanban-board";

interface TaskKanbanViewProps {
  tasks: Task[];
  isLoading: boolean;
  searchTerm: string;
  statusFilter: string;
  assigneeFilter: string;
  dueDateFilter: string;
  workspaceId: string;
  projectId: string;
}

export const TaskKanbanView = ({
  tasks,
  isLoading,
  searchTerm,
  statusFilter,
  assigneeFilter,
  dueDateFilter,
  workspaceId,
  projectId,
}: TaskKanbanViewProps) => {
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
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

      // Due date filter
      if (dueDateFilter !== "all") {
        const now = new Date();
        const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;

        switch (dueDateFilter) {
          case "overdue":
            if (!taskDueDate || taskDueDate >= now) return false;
            break;
          case "today":
            if (!taskDueDate || taskDueDate.toDateString() !== now.toDateString()) return false;
            break;
          case "week":
            if (!taskDueDate) return false;
            const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            if (taskDueDate < now || taskDueDate > weekFromNow) return false;
            break;
          case "month":
            if (!taskDueDate) return false;
            const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            if (taskDueDate < now || taskDueDate > monthFromNow) return false;
            break;
          case "no-date":
            if (taskDueDate) return false;
            break;
        }
      }

      return true;
    });
  }, [tasks, searchTerm, statusFilter, assigneeFilter, dueDateFilter]);

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="relative mx-auto w-8 h-8">
          <div className="w-8 h-8 border-2 border-slate-200 rounded-full"></div>
          <div className="absolute inset-0 w-8 h-8 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-2 text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="h-full p-4">
      <KanbanBoard
        tasks={filteredTasks}
      />
    </div>
  );
};