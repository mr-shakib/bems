"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Clock, 
  Calendar,
  GripVertical
} from "lucide-react";
import { format } from "date-fns";
import { Task, TaskStatus, TASK_STATUS_COLORS, TASK_STATUS_BADGE_COLORS, TASK_STATUS_LABELS } from "../types";
import { useDeleteTask } from "../api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";
import { cn } from "@/lib/utils";

interface KanbanTaskCardProps {
  task: Task & {
    assignee?: {
      $id: string;
      name: string;
      email: string;
    } | null;
  };
  onEdit?: (task: Task) => void;
  onView?: (task: Task) => void;
  isDragging?: boolean;
}

const getCardBackgroundColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.BACKLOG:
      return "bg-gradient-to-br from-red-50 to-red-100/50 hover:from-red-100 hover:to-red-150/50";
    case TaskStatus.TODO:
      return "bg-gradient-to-br from-slate-50 to-slate-100/50 hover:from-slate-100 hover:to-slate-150/50";
    case TaskStatus.IN_PROGRESS:
      return "bg-gradient-to-br from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-150/50";
    case TaskStatus.IN_REVIEW:
      return "bg-gradient-to-br from-yellow-50 to-yellow-100/50 hover:from-yellow-100 hover:to-yellow-150/50";
    case TaskStatus.DONE:
      return "bg-gradient-to-br from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-150/50";
    default:
      return "bg-gradient-to-br from-gray-50 to-gray-100/50 hover:from-gray-100 hover:to-gray-150/50";
  }
};

const getCardBorderColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.BACKLOG:
      return "border-red-200 hover:border-red-300";
    case TaskStatus.TODO:
      return "border-slate-200 hover:border-slate-300";
    case TaskStatus.IN_PROGRESS:
      return "border-blue-200 hover:border-blue-300";
    case TaskStatus.IN_REVIEW:
      return "border-yellow-200 hover:border-yellow-300";
    case TaskStatus.DONE:
      return "border-green-200 hover:border-green-300";
    default:
      return "border-gray-200 hover:border-gray-300";
  }
};

export const KanbanTaskCard = ({ 
  task, 
  onEdit, 
  onView, 
  isDragging = false 
}: KanbanTaskCardProps) => {
  const { mutate: deleteTask } = useDeleteTask();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Task",
    "Are you sure you want to delete this task? This action cannot be undone.",
    "destructive"
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.$id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.8 : 1,
  };

  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteTask({ param: { taskId: task.$id } });
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(task);
  };

  const handleView = () => {
    onView?.(task);
  };

  return (
    <>
      <ConfirmDialog />
      <Card 
        ref={setNodeRef}
        style={style}
        className={cn(
          "group cursor-pointer border-2 hover:shadow-md transition-all duration-200",
          "border-l-4", // Thick left border
          TASK_STATUS_COLORS[task.status], // Left border color from types
          getCardBackgroundColor(task.status), // Status-based background gradient
          getCardBorderColor(task.status), // Status-based border colors
          isDragging && "shadow-lg scale-105"
        )}
        onClick={handleView}
        {...attributes}
      >
        <CardContent className="p-4 space-y-3">
          {/* Header with drag handle and menu */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <button
                className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1 -ml-1 hover:bg-gray-100 rounded"
                {...listeners}
              >
                <GripVertical className="h-3 w-3 text-gray-400" />
              </button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Task Title and Status */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-sm leading-tight line-clamp-2 text-gray-900 flex-1">
                {task.name}
              </h4>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs font-medium border-0 shadow-sm shrink-0",
                  TASK_STATUS_BADGE_COLORS[task.status]
                )}
              >
                {TASK_STATUS_LABELS[task.status]}
              </Badge>
            </div>
          </div>

          {/* Task Description */}
          {task.description && (
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Task Metadata */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {task.assignee && (
                <div className="flex items-center gap-1.5">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-xs bg-blue-50 text-blue-700">
                      {task.assignee.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-gray-600 font-medium truncate max-w-16">
                    {task.assignee.name}
                  </span>
                </div>
              )}

              {task.estimatedHours && (
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{task.estimatedHours}h</span>
                </div>
              )}
            </div>

            {task.dueDate && (
              <div className="flex items-center gap-1 text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(task.dueDate), "MMM dd")}</span>
              </div>
            )}
          </div>

          {/* Labels */}
          {task.labels && task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.labels.slice(0, 2).map((label) => (
                <Badge 
                  key={label} 
                  variant="outline" 
                  className="text-xs px-2 py-1 bg-gray-50 border-gray-200 text-gray-700"
                >
                  {label}
                </Badge>
              ))}
              {task.labels.length > 2 && (
                <Badge variant="outline" className="text-xs px-2 py-1 bg-gray-50 border-gray-200 text-gray-700">
                  +{task.labels.length - 2}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};