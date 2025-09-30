"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task, TaskStatus, TASK_STATUS_COLORS } from "../types";
import { KanbanTaskCard } from "./kanban-task-card";
import { Badge } from "@/components/ui/badge";

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
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg border">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${statusColorClass}`} />
          <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
        </div>
        <Badge variant="secondary" className="text-xs">
          {tasks.length}
        </Badge>
      </div>

      {/* Droppable Area */}
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[500px] p-2 rounded-lg transition-colors ${
          isOver 
            ? "bg-blue-50 border-2 border-blue-200 border-dashed" 
            : "bg-gray-25 border border-gray-100"
        }`}
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