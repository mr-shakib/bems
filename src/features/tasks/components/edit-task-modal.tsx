"use client";

import { ResponsiveModal } from "@/components/responsive_modal";
import { EditTaskForm } from "./edit-task-form";
import { Task } from "../types";

interface EditTaskModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

export const EditTaskModal = ({ 
  isOpen, 
  onOpenChange, 
  task 
}: EditTaskModalProps) => {
  if (!task) return null;

  return (
    <ResponsiveModal open={isOpen} onOpenChange={onOpenChange}>
      <EditTaskForm 
        onCancel={() => onOpenChange(false)}
        onSuccess={() => onOpenChange(false)}
        task={task}
      />
    </ResponsiveModal>
  );
};