"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings,
  Plus,
  Search,
  Calendar as CalendarIcon,
  Table as TableIcon,
  LayoutGrid,
  BarChart3,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Link from "next/link";
import { Project } from "../types";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { TaskTableView } from "./task-table-view";
import { TaskKanbanView } from "./task-kanban-view";
import { TaskCalendarView } from "./task-calendar-view";
import { TaskFilters } from "./task-filters";
import { ProjectAnalytics } from "./project-analytics";
import { Input } from "@/components/ui/input";

interface ProjectTasksViewProps {
  project: Project;
  workspaceId: string;
}

export const ProjectTasksView = ({ project, workspaceId }: ProjectTasksViewProps) => {
  const [activeTab, setActiveTab] = useState("table");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [dueDateFilter, setDueDateFilter] = useState("all");

  // Fetch tasks specifically for this project
  const { data: tasks, isLoading: tasksLoading } = useGetTasks({
    workspaceId,
    projectId: project.$id, // This ensures we only get tasks for this specific project
  });

  const allTasks = tasks?.documents || [];

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:ml-auto">
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
            
            <Button variant="outline" size="sm" asChild className="h-9 px-3 text-sm">
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}/settings`}>
                <Settings className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Settings</span>
                <span className="sm:hidden">Settings</span>
              </Link>
            </Button>
            <Button size="sm" className="h-9 px-3 text-sm">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">New Task</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        {/* Analytics Section */}
        {showAnalytics && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Project Analytics</h2>
            </div>
            <ProjectAnalytics 
              project={project}
              tasks={allTasks} 
              isLoading={tasksLoading}
            />
          </div>
        )}

        {/* Compact Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-gray-300 focus:ring-1 h-9 text-sm"
              />
            </div>
            <div className="flex-shrink-0">
              <TaskFilters
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                assigneeFilter={assigneeFilter}
                setAssigneeFilter={setAssigneeFilter}
                dueDateFilter={dueDateFilter}
                setDueDateFilter={setDueDateFilter}
                workspaceId={workspaceId}
              />
            </div>
          </div>

          {/* Minimal Tab Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="h-9 bg-gray-100">
              <TabsTrigger value="table" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                <TableIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Table</span>
              </TabsTrigger>
              <TabsTrigger value="kanban" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                <LayoutGrid className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Board</span>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Calendar</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Task Views */}
        <div className="bg-white rounded-lg border border-gray-200 min-h-[400px] sm:min-h-[600px]">
          <Tabs value={activeTab} className="w-full h-full">
            <TabsContent value="table" className="m-0 h-full">
              <TaskTableView
                tasks={allTasks}
                isLoading={tasksLoading}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                assigneeFilter={assigneeFilter}
                dueDateFilter={dueDateFilter}
                workspaceId={workspaceId}
                projectId={project.$id}
              />
            </TabsContent>
            <TabsContent value="kanban" className="m-0 h-full">
              <TaskKanbanView
                tasks={allTasks}
                isLoading={tasksLoading}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                assigneeFilter={assigneeFilter}
                dueDateFilter={dueDateFilter}
                workspaceId={workspaceId}
                projectId={project.$id}
              />
            </TabsContent>
            <TabsContent value="calendar" className="m-0 h-full">
              <TaskCalendarView
                tasks={allTasks}
                isLoading={tasksLoading}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                assigneeFilter={assigneeFilter}
                dueDateFilter={dueDateFilter}
                workspaceId={workspaceId}
                projectId={project.$id}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};