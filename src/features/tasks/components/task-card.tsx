"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import { Task, TaskStatus } from "../types";
import { useDeleteTask } from "../api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";

interface TaskCardProps {
  task: Task & {
    assignee?: {
      $id: string;
      name: string;
      email: string;
    } | null;
  };
  onEdit?: (task: Task) => void;
  onView?: (task: Task) => void;
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

export const TaskCard = ({ task, onEdit, onView }: TaskCardProps) => {
  const { mutate: deleteTask } = useDeleteTask();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Task",
    "Are you sure you want to delete this task? This action cannot be undone.",
    "destructive"
  );

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
        className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col bg-white border border-gray-200 hover:border-gray-300"
        onClick={handleView}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <Badge 
                  variant="outline" 
                  className={`${getStatusColor(task.status)} text-xs font-medium border-0`}
                >
                  {getStatusLabel(task.status)}
                </Badge>
              </div>
              
              <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-gray-900 mb-1">
                {task.name}
              </h3>
              
              {task.description && (
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
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
        </CardHeader>

        <CardContent className="pt-0 mt-auto">
          <div className="space-y-3">
            {/* Task metadata */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                {task.assignee && (
                  <div className="flex items-center gap-1.5">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-xs bg-blue-50 text-blue-700">
                        {task.assignee.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-600 font-medium truncate max-w-20">
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
                {task.labels.slice(0, 3).map((label) => (
                  <Badge 
                    key={label} 
                    variant="outline" 
                    className="text-xs px-2 py-1 bg-gray-50 border-gray-200 text-gray-700"
                  >
                    {label}
                  </Badge>
                ))}
                {task.labels.length > 3 && (
                  <Badge variant="outline" className="text-xs px-2 py-1 bg-gray-50 border-gray-200 text-gray-700">
                    +{task.labels.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};