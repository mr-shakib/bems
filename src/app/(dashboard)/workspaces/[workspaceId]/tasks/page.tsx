"use client";

import { useState } from "react";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useTaskFilters } from "@/features/tasks/hooks/use-task-filters";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Grid3X3, Kanban, BarChart3, ChevronDown, ChevronUp } from "lucide-react";
import { Task } from "@/features/tasks/types";
import { TaskList } from "@/features/tasks/components/task-list";
import { KanbanBoard } from "@/features/tasks/components/kanban-board";
import { CreateTaskModal } from "@/features/tasks/components/create-task-modal";
import { EditTaskModal } from "@/features/tasks/components/edit-task-modal";
import { TaskDetailsModal } from "@/features/tasks/components/task-details-modal";
import { TaskAnalytics } from "@/features/tasks/components/task-analytics";

type ViewMode = "grid" | "kanban";

export default function TasksPage() {
  const workspaceId = useWorkspaceId();
  const { projectId, status, assigneeId, search } = useTaskFilters();
  
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  const { 
    data: tasks, 
    isLoading 
  } = useGetTasks({ 
    workspaceId,
    projectId: projectId || undefined,
    status: (status as any) || undefined,
    assigneeId: assigneeId || undefined,
    search: search || undefined,
  });

  const handleCreateTask = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleViewTask = (task: Task) => {
    setViewingTask(task);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteTaskFromDetails = (task: Task) => {
    // You can implement delete functionality here
    console.log("Delete task:", task.$id);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <div className="h-full flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2 sm:ml-auto">
            {/* Analytics Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="h-9 px-3 text-sm"
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Analytics
              {showAnalytics ? (
                <ChevronUp className="h-4 w-4 ml-1" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-1" />
              )}
            </Button>
            
            {/* View Mode Toggle */}
            <div className="flex items-center border rounded-lg p-1 bg-gray-50">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 px-2 sm:px-3 text-xs sm:text-sm flex-1 sm:flex-none"
              >
                <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">Grid</span>
              </Button>
              <Button
                variant={viewMode === "kanban" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("kanban")}
                className="h-8 px-2 sm:px-3 text-xs sm:text-sm flex-1 sm:flex-none"
              >
                <Kanban className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">Kanban</span>
              </Button>
            </div>
            
            <Button onClick={handleCreateTask} className="h-9 px-3 text-sm">
              <Plus className="size-3 sm:size-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">New Task</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        {/* Analytics Section */}
        {showAnalytics && (
          <Card className="border border-gray-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Workspace Analytics</h2>
              </div>
              <TaskAnalytics 
                tasks={tasks?.documents || []} 
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        )}

        {tasks?.documents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
              <div className="text-center">
                <h3 className="text-base sm:text-lg font-medium">No tasks found</h3>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                  Create your first task to get started
                </p>
                <Button className="mt-4 h-9 px-4 text-sm" onClick={handleCreateTask}>
                  <Plus className="size-3 sm:size-4 mr-2" />
                  Create Task
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex-1 overflow-hidden">
            {viewMode === "grid" ? (
              <TaskList 
                tasks={tasks?.documents || []} 
                onEdit={handleEditTask}
                onView={handleViewTask}
              />
            ) : (
              <KanbanBoard
                tasks={tasks?.documents || []}
                onEdit={handleEditTask}
                onView={handleViewTask}
              />
            )}
          </div>
        )}
      </div>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      <EditTaskModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        task={editingTask}
      />

      <TaskDetailsModal
        task={viewingTask}
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        onEdit={handleEditTask}
        onDelete={handleDeleteTaskFromDetails}
      />
    </>
  );
}