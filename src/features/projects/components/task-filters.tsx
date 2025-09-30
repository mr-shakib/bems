"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter, Calendar, User } from "lucide-react";
import { TaskStatus } from "@/features/tasks/types";

interface TaskFiltersProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  assigneeFilter: string;
  setAssigneeFilter: (assignee: string) => void;
  dueDateFilter: string;
  setDueDateFilter: (dueDate: string) => void;
  workspaceId: string;
}

const statusOptions = [
  { value: "all", label: "All statuses", count: null },
  { value: TaskStatus.TODO, label: "To Do", count: null },
  { value: TaskStatus.IN_PROGRESS, label: "In Progress", count: null },
  { value: TaskStatus.IN_REVIEW, label: "In Review", count: null },
  { value: TaskStatus.DONE, label: "Done", count: null },
];

const assigneeOptions = [
  { value: "all", label: "All assignees", count: null },
  // These would be populated from actual workspace members
];

const dueDateOptions = [
  { value: "all", label: "All dates", count: null },
  { value: "overdue", label: "Overdue", count: null },
  { value: "today", label: "Due today", count: null },
  { value: "week", label: "Due this week", count: null },
  { value: "month", label: "Due this month", count: null },
  { value: "no-date", label: "No due date", count: null },
];

export const TaskFilters = ({
  statusFilter,
  setStatusFilter,
  assigneeFilter,
  setAssigneeFilter,
  dueDateFilter,
  setDueDateFilter,
  workspaceId,
}: TaskFiltersProps) => {
  const getActiveFiltersCount = () => {
    let count = 0;
    if (statusFilter !== "all") count++;
    if (assigneeFilter !== "all") count++;
    if (dueDateFilter !== "all") count++;
    return count;
  };

  const clearAllFilters = () => {
    setStatusFilter("all");
    setAssigneeFilter("all");
    setDueDateFilter("all");
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Status Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 h-8">
            <Filter className="h-3 w-3" />
            Status
            {statusFilter !== "all" && (
              <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                1
              </Badge>
            )}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          <DropdownMenuLabel className="text-xs">Filter by status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {statusOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`text-sm ${statusFilter === option.value ? "bg-accent" : ""}`}
            >
              <div className="flex items-center justify-between w-full">
                <span>{option.label}</span>
                {statusFilter === option.value && (
                  <Badge variant="secondary" className="h-4 w-4 p-0 text-xs">
                    ✓
                  </Badge>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Assignee Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 h-8">
            <User className="h-3 w-3" />
            Assignee
            {assigneeFilter !== "all" && (
              <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                1
              </Badge>
            )}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          <DropdownMenuLabel className="text-xs">Filter by assignee</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {assigneeOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setAssigneeFilter(option.value)}
              className={`text-sm ${assigneeFilter === option.value ? "bg-accent" : ""}`}
            >
              <div className="flex items-center justify-between w-full">
                <span>{option.label}</span>
                {assigneeFilter === option.value && (
                  <Badge variant="secondary" className="h-4 w-4 p-0 text-xs">
                    ✓
                  </Badge>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Due Date Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 h-8">
            <Calendar className="h-3 w-3" />
            Due date
            {dueDateFilter !== "all" && (
              <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                1
              </Badge>
            )}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          <DropdownMenuLabel className="text-xs">Filter by due date</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {dueDateOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setDueDateFilter(option.value)}
              className={`text-sm ${dueDateFilter === option.value ? "bg-accent" : ""}`}
            >
              <div className="flex items-center justify-between w-full">
                <span>{option.label}</span>
                {dueDateFilter === option.value && (
                  <Badge variant="secondary" className="h-4 w-4 p-0 text-xs">
                    ✓
                  </Badge>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 text-xs">
          Clear ({activeFiltersCount})
        </Button>
      )}
    </div>
  );
};