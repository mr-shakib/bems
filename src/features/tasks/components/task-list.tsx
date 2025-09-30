"use client";

import { Task } from "../types";
import { TaskCard } from "./task-card";

interface TaskListProps {
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

export const TaskList = ({ tasks, onEdit, onView }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center mb-4">
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
            className="text-muted-foreground sm:w-6 sm:h-6"
          >
            <path d="M9 12l2 2 4-4" />
            <path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1" />
            <path d="M3 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1" />
            <path d="M12 21c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1" />
            <path d="M12 3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1" />
          </svg>
        </div>
        <h3 className="text-base sm:text-lg font-medium text-muted-foreground">No tasks found</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Create your first task to get started with your project
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {tasks.map((task) => (
        <TaskCard 
          key={task.$id} 
          task={task} 
          onEdit={onEdit}
          onView={onView}
        />
      ))}
    </div>
  );
};