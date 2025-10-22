"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  Eye,
  ExternalLink,
  Edit,
  Trash2,
  User,
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import { Task, TaskStatus } from "@/features/tasks/types";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "./project-avatar";
import { TaskDetailsModal } from "@/features/tasks/components/task-details-modal";
import Link from "next/link";

interface TaskTableViewProps {
  tasks: Task[];
  isLoading: boolean;
  searchTerm: string;
  statusFilter: string;
  assigneeFilter: string;
  dueDateFilter: string;
  workspaceId: string;
  projectId: string;
}

type SortField = "name" | "assignee" | "dueDate" | "status";
type SortDirection = "asc" | "desc";

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.TODO:
      return "bg-gray-100 text-gray-800 border-gray-200";
    case TaskStatus.IN_PROGRESS:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case TaskStatus.IN_REVIEW:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case TaskStatus.DONE:
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
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

export const TaskTableView = ({
  tasks,
  isLoading,
  searchTerm,
  statusFilter,
  assigneeFilter,
  dueDateFilter,
  workspaceId,
  projectId,
}: TaskTableViewProps) => {
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-medium hover:bg-transparent"
      onClick={() => handleSort(field)}
    >
      <span className="flex items-center gap-1">
        {children}
        {sortField === field ? (
          sortDirection === "asc" ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )
        ) : (
          <div className="h-4 w-4" />
        )}
      </span>
    </Button>
  );

  const filteredAndSortedTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      // Search filter
      if (searchTerm && !task.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all" && task.status !== statusFilter) {
        return false;
      }

      // Assignee filter (simplified for now)
      if (assigneeFilter !== "all") {
        // This would need to be implemented with actual assignee data
      }

      // Due date filter
      if (dueDateFilter !== "all") {
        const now = new Date();
        const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;

        switch (dueDateFilter) {
          case "overdue":
            if (!taskDueDate || taskDueDate >= now) return false;
            break;
          case "today":
            if (!taskDueDate || taskDueDate.toDateString() !== now.toDateString()) return false;
            break;
          case "week":
            if (!taskDueDate) return false;
            const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            if (taskDueDate < now || taskDueDate > weekFromNow) return false;
            break;
          case "month":
            if (!taskDueDate) return false;
            const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            if (taskDueDate < now || taskDueDate > monthFromNow) return false;
            break;
          case "no-date":
            if (taskDueDate) return false;
            break;
        }
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "assignee":
          aValue = a.assignee?.name?.toLowerCase() || "";
          bValue = b.assignee?.name?.toLowerCase() || "";
          break;
        case "dueDate":
          aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [tasks, searchTerm, statusFilter, assigneeFilter, dueDateFilter, sortField, sortDirection]);

  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <div className="mx-auto w-8 h-8 bg-gradient-to-r from-transparent via-slate-400 to-transparent animate-shimmer rounded-full" style={{ backgroundSize: '200% 100%' }}></div>
        <p className="mt-3 text-sm text-gray-500">Loading tasks...</p>
      </div>
    );
  }

  if (filteredAndSortedTasks.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">No tasks found</p>
        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or create a new task.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-gray-200">
              <TableHead className="w-[45%] font-medium text-gray-700">
                <SortButton field="name">Task Name</SortButton>
              </TableHead>
              <TableHead className="w-[20%] font-medium text-gray-700">
                <SortButton field="assignee">Assignee</SortButton>
              </TableHead>
              <TableHead className="w-[20%] font-medium text-gray-700">
                <SortButton field="dueDate">Due Date</SortButton>
              </TableHead>
              <TableHead className="w-[10%] font-medium text-gray-700">
                <SortButton field="status">Status</SortButton>
              </TableHead>
              <TableHead className="w-[5%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTasks.map((task) => (
              <TableRow key={task.$id} className="hover:bg-gray-50/50 border-gray-100">
                <TableCell className="font-medium py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{task.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  {task.assignee ? (
                    <div className="flex items-center gap-2">
                      <MemberAvatar
                        name={task.assignee.name}
                        className="size-6"
                        fallbackClassName="text-xs"
                      />
                      <span className="text-sm text-gray-700 truncate">{task.assignee.name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                      <User className="h-4 w-4" />
                      <span className="text-sm">Unassigned</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="py-4">
                  {task.dueDate ? (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {format(new Date(task.dueDate), "MMM d, yyyy")}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">No due date</span>
                  )}
                </TableCell>
                <TableCell className="py-4">
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(task.status)} border-0 font-medium`}
                  >
                    {getStatusLabel(task.status)}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => setSelectedTask(task)} className="text-sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Task Details
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/workspaces/${workspaceId}/projects/${task.projectId}`} className="text-sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Project
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Task
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 text-sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Minimal Pagination */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-white">
        <div className="text-sm text-gray-500">
          {filteredAndSortedTasks.length} of {tasks.length} tasks
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled className="h-8 text-xs">
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled className="h-8 text-xs">
            Next
          </Button>
        </div>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
        />
      )}
    </div>
  );
};