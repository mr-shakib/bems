import { Models } from "node-appwrite";

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW", 
  DONE = "DONE"
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH", 
  URGENT = "URGENT"
}

export enum TaskType {
  TASK = "TASK",
  BUG = "BUG",
  STORY = "STORY",
  EPIC = "EPIC"
}

export type Task = Models.Document & {
  name: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  type?: TaskType;
  assigneeId: string;
  projectId: string;
  workspaceId: string;
  dueDate?: string;
  position: number;
  createdBy?: string;
  labels?: string[];
  estimatedHours?: number;
  loggedHours?: number;
  assignee?: {
    $id: string;
    name: string;
    email: string;
  } | null;
};

// Card border colors for different statuses
export const TASK_STATUS_COLORS = {
  [TaskStatus.BACKLOG]: "border-l-red-400",
  [TaskStatus.TODO]: "border-l-slate-500", 
  [TaskStatus.IN_PROGRESS]: "border-l-blue-500",
  [TaskStatus.IN_REVIEW]: "border-l-yellow-500",
  [TaskStatus.DONE]: "border-l-green-500"
} as const;

// Badge colors for status indicators
export const TASK_STATUS_BADGE_COLORS = {
  [TaskStatus.BACKLOG]: "bg-gray-100 text-red-700",
  [TaskStatus.TODO]: "bg-slate-100 text-slate-700",
  [TaskStatus.IN_PROGRESS]: "bg-blue-100 text-blue-700", 
  [TaskStatus.IN_REVIEW]: "bg-yellow-100 text-yellow-700",
  [TaskStatus.DONE]: "bg-green-100 text-green-700"
} as const;

export const TASK_PRIORITY_COLORS = {
  [TaskPriority.LOW]: "bg-green-100 text-green-800",
  [TaskPriority.MEDIUM]: "bg-yellow-100 text-yellow-800",
  [TaskPriority.HIGH]: "bg-orange-100 text-orange-800",
  [TaskPriority.URGENT]: "bg-red-100 text-red-800"
} as const;

export const TASK_TYPE_COLORS = {
  [TaskType.TASK]: "bg-blue-100 text-blue-800",
  [TaskType.BUG]: "bg-red-100 text-red-800", 
  [TaskType.STORY]: "bg-green-100 text-green-800",
  [TaskType.EPIC]: "bg-purple-100 text-purple-800"
} as const;

export const TASK_STATUS_LABELS = {
  [TaskStatus.BACKLOG]: "Backlog",
  [TaskStatus.TODO]: "To Do",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.IN_REVIEW]: "In Review",
  [TaskStatus.DONE]: "Done"
} as const;