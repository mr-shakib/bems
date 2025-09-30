"use client";

import { ResponsiveModal } from "@/components/responsive_modal";
import { CreateTaskForm } from "./create-task-form";

interface CreateTaskModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
}

export const CreateTaskModal = ({ 
  isOpen, 
  onOpenChange, 
  projectId 
}: CreateTaskModalProps) => {
  return (
    <ResponsiveModal open={isOpen} onOpenChange={onOpenChange}>
      <CreateTaskForm 
        onCancel={() => onOpenChange(false)}
        onSuccess={() => onOpenChange(false)}
        projectId={projectId}
      />
    </ResponsiveModal>
  );
};