"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task, TaskStatus, TASK_STATUS_COLORS, TASK_STATUS_BADGE_COLORS, TASK_STATUS_LABELS } from "../types";
import { KanbanTaskCard } from "./kanban-task-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: (Task & {
    assignee?: {
      $id: string;
      name: string;
      email: string;
    } | null;
  })[];
  onEdit?: (task: Task) => void;
  onView?: (task: Task) => void;
}

const getColumnHeaderColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.BACKLOG:
      return "bg-gradient-to-r from-red-50 to-red-100 border-red-200";
    case TaskStatus.TODO:
      return "bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200";
    case TaskStatus.IN_PROGRESS:
      return "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200";
    case TaskStatus.IN_REVIEW:
      return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200";
    case TaskStatus.DONE:
      return "bg-gradient-to-r from-green-50 to-green-100 border-green-200";
    default:
      return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200";
  }
};

const getDroppableAreaColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.BACKLOG:
      return "bg-red-25 border-red-100";
    case TaskStatus.TODO:
      return "bg-slate-25 border-slate-100";
    case TaskStatus.IN_PROGRESS:
      return "bg-blue-25 border-blue-100";
    case TaskStatus.IN_REVIEW:
      return "bg-yellow-25 border-yellow-100";
    case TaskStatus.DONE:
      return "bg-green-25 border-green-100";
    default:
      return "bg-gray-25 border-gray-100";
  }
};

const getColumnBorderColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.BACKLOG:
      return "border-t-red-400";
    case TaskStatus.TODO:
      return "border-t-slate-500";
    case TaskStatus.IN_PROGRESS:
      return "border-t-blue-500";
    case TaskStatus.IN_REVIEW:
      return "border-t-yellow-500";
    case TaskStatus.DONE:
      return "border-t-green-500";
    default:
      return "border-t-gray-400";
  }
};

export const KanbanColumn = ({ 
  status, 
  title, 
  tasks, 
  onEdit, 
  onView 
}: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const statusColorClass = TASK_STATUS_COLORS[status];

  return (
    <div className="flex flex-col min-w-[320px] max-w-[320px]">
      {/* Column Header */}
      <div className={cn(
        "flex items-center justify-between mb-4 p-4 rounded-lg border-2 border-t-4 shadow-sm",
        getColumnHeaderColor(status),
        getColumnBorderColor(status)
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-4 h-4 rounded-full shadow-sm",
            statusColorClass.replace('border-l-', 'bg-')
          )} />
          <h3 className="font-bold text-base text-gray-900">{title}</h3>
        </div>
        <Badge 
          variant="outline" 
          className={cn(
            "text-xs font-semibold border-0 shadow-sm",
            TASK_STATUS_BADGE_COLORS[status]
          )}
        >
          {tasks.length}
        </Badge>
      </div>

      {/* Droppable Area */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 min-h-[500px] p-2 rounded-lg transition-colors border",
          isOver 
            ? "bg-blue-50 border-2 border-blue-200 border-dashed" 
            : getDroppableAreaColor(status)
        )}
      >
        <SortableContext 
          items={tasks.map(task => task.$id)} 
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {tasks.map((task) => (
              <KanbanTaskCard
                key={task.$id}
                task={task}
                onEdit={onEdit}
                onView={onView}
              />
            ))}
            
            {tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <path d="M9 12l2 2 4-4" />
                    <path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1" />
                    <path d="M3 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">No tasks</p>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};