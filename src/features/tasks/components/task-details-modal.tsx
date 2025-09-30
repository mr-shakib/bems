"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar,
  User,
  Clock,
  FolderOpen,
  Edit3,
  Trash2,
  Tag
} from "lucide-react";
import { Task, TaskStatus } from "../types";
import { format } from "date-fns";

interface TaskDetailsModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.TODO:
      return "bg-gray-100 text-gray-700 border-gray-200";
    case TaskStatus.IN_PROGRESS:
      return "bg-blue-100 text-blue-700 border-blue-200";
    case TaskStatus.IN_REVIEW:
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case TaskStatus.DONE:
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getStatusLabel = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.TODO:
      return "To Do";
    case TaskStatus.IN_PROGRESS:
      return "In Progress";
    case TaskStatus.IN_REVIEW:
      return "In Review";
    case TaskStatus.DONE:
      return "Done";
    default:
      return status;
  }
};

export const TaskDetailsModal = ({
  task,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: TaskDetailsModalProps) => {
  if (!task) return null;

  const handleEdit = () => {
    onEdit?.(task);
    onOpenChange(false);
  };

  const handleDelete = () => {
    onDelete?.(task);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 space-y-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-3 sm:pr-4">
              <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight">
                {task.name}
              </DialogTitle>
              <div className="mt-2">
                <Badge 
                  variant="outline" 
                  className={`${getStatusColor(task.status)} text-xs font-medium border-0`}
                >
                  {getStatusLabel(task.status)}
                </Badge>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Separator />

        {/* Content */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 overflow-y-auto">
          <div className="space-y-4 sm:space-y-6">
            {/* Description */}
            {task.description && task.description.trim() !== "" && (
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Description</h3>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {task.description}
                  </p>
                </div>
              </div>
            )}

            {/* Task Information */}
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-3">Details</h3>
              <div className="space-y-3">
                {/* Assignee */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-blue-50 rounded-lg">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Assignee</p>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">
                      {task.assignee?.name || "Unassigned"}
                    </p>
                  </div>
                </div>

                {/* Due Date */}
                {task.dueDate && task.dueDate.trim() !== "" && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-orange-50 rounded-lg">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Due Date</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">
                        {(() => {
                          try {
                            return format(new Date(task.dueDate), "MMM dd, yyyy");
                          } catch {
                            return task.dueDate;
                          }
                        })()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Project */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-green-50 rounded-lg">
                    <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Project</p>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">
                      {(task as any).project?.name || `Project ${task.projectId?.slice(-8) || ""}`}
                    </p>
                  </div>
                </div>

                {/* Estimated Hours */}
                {task.estimatedHours && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-purple-50 rounded-lg">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Estimated Hours</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">
                        {task.estimatedHours}h
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Labels */}
            {task.labels && task.labels.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                  <h3 className="text-xs sm:text-sm font-medium text-gray-700">Labels</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {task.labels.map((label, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs px-2 py-1 bg-gray-50 border-gray-200 text-gray-700"
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="pt-3 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs text-gray-500">
                <div>
                  <p className="font-medium">Created</p>
                  <p>{format(new Date(task.$createdAt), "MMM dd, yyyy")}</p>
                </div>
                <div>
                  <p className="font-medium">Updated</p>
                  <p>{format(new Date(task.$updatedAt), "MMM dd, yyyy")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};