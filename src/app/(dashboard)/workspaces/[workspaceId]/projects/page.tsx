"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Search,
  FolderOpen,
  Calendar,
  Users,
  BarChart3,
  Grid3X3,
  List
} from "lucide-react";
import Link from "next/link";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { Task, TaskStatus } from "@/features/tasks/types";
import { Project } from "@/features/projects/types";
import { format } from "date-fns";

type ViewMode = "grid" | "list";

export default function ProjectsPage() {
  const workspaceId = useWorkspaceId();
  const { open } = useCreateProjectModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const { data: projects, isLoading: projectsLoading } = useGetProjects({ workspaceId });
  const { data: tasks, isLoading: tasksLoading } = useGetTasks({ workspaceId });

  const allProjects = projects?.documents || [];
  const allTasks = tasks?.documents || [];

  // Filter projects based on search
  const filteredProjects = allProjects.filter(project =>
    (project as Project).name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project as Project).description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate project statistics
  const getProjectStats = (projectId: string) => {
    const projectTasks = allTasks.filter(task => task.projectId === projectId);
    const completed = projectTasks.filter(task => task.status === TaskStatus.DONE).length;
    const inProgress = projectTasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;
    const todo = projectTasks.filter(task => task.status === TaskStatus.TODO).length;
    const completionRate = projectTasks.length > 0 ? (completed / projectTasks.length) * 100 : 0;

    return {
      total: projectTasks.length,
      completed,
      inProgress,
      todo,
      completionRate
    };
  };

  if (projectsLoading || tasksLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4 sm:space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:ml-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg p-1 bg-gray-50">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
            >
              <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Grid</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
            >
              <List className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">List</span>
            </Button>
          </div>
          
          <Button onClick={open} className="h-9 px-3 text-sm">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">New Project</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
            <div className="text-center">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium">
                {searchTerm ? "No projects found" : "No projects yet"}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                {searchTerm 
                  ? "Try adjusting your search terms"
                  : "Create your first project to get started"
                }
              </p>
              {!searchTerm && (
                <Button className="mt-4 h-9 px-4 text-sm" onClick={open}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex-1">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProjects.map((project) => {
                const stats = getProjectStats(project.$id);
                const typedProject = project as Project;
                
                return (
                  <Link 
                    key={project.$id} 
                    href={`/workspaces/${workspaceId}/projects/${project.$id}`}
                    className="block group"
                  >
                    <Card className="h-full hover:shadow-md transition-all duration-200 group-hover:scale-[1.02]">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <ProjectAvatar 
                            image={typedProject.imageUrl} 
                            name={typedProject.name}
                            className="h-10 w-10"
                            fallbackClassName="text-sm"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{typedProject.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {stats.total} tasks
                            </p>
                          </div>
                        </div>
                        
                        {typedProject.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {typedProject.description}
                          </p>
                        )}
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{stats.completionRate.toFixed(0)}%</span>
                          </div>
                          <Progress value={stats.completionRate} className="h-2" />
                          
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-4">
                              <span className="text-green-600">{stats.completed} done</span>
                              <span className="text-blue-600">{stats.inProgress} active</span>
                            </div>
                            <span className="text-muted-foreground">
                              {format(new Date(project.$createdAt), 'MMM dd')}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredProjects.map((project) => {
                    const stats = getProjectStats(project.$id);
                    const typedProject = project as Project;
                    
                    return (
                      <Link 
                        key={project.$id} 
                        href={`/workspaces/${workspaceId}/projects/${project.$id}`}
                        className="block hover:bg-gray-50 transition-colors"
                      >
                        <div className="p-4 sm:p-6">
                          <div className="flex items-center gap-4">
                            <ProjectAvatar 
                              image={typedProject.imageUrl} 
                              name={typedProject.name}
                              className="h-10 w-10"
                              fallbackClassName="text-sm"
                            />
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold truncate">{typedProject.name}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {stats.completionRate.toFixed(0)}% complete
                                </Badge>
                              </div>
                              
                              {typedProject.description && (
                                <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                                  {typedProject.description}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                                <span>{stats.total} tasks</span>
                                <span>{stats.completed} completed</span>
                                <span>{stats.inProgress} in progress</span>
                                <span>Created {format(new Date(project.$createdAt), 'MMM dd, yyyy')}</span>
                              </div>
                            </div>
                            
                            <div className="flex-shrink-0 w-24">
                              <Progress value={stats.completionRate} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Results Info */}
      {filteredProjects.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Showing {filteredProjects.length} of {allProjects.length} projects
          </p>
          {searchTerm && (
            <Badge variant="secondary" className="text-xs">
              Search: {searchTerm}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}