import { Models } from "node-appwrite";

export enum TaskStatus {
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
  priority?: TaskPriority; // Made optional since database doesn't support it yet
  type?: TaskType; // Made optional since database doesn't support it yet
  assigneeId: string;
  projectId: string;
  workspaceId: string;
  dueDate?: string; // Keep optional for UI, handle in server
  position: number;
  createdBy?: string; // Made optional since database doesn't support it yet
  labels?: string[];
  estimatedHours?: number;
  loggedHours?: number;
  // Populated by server
  assignee?: {
    $id: string;
    name: string;
    email: string;
  } | null;
};

export const TASK_STATUS_COLORS = {
  [TaskStatus.TODO]: "bg-gray-500",
  [TaskStatus.IN_PROGRESS]: "bg-blue-500", 
  [TaskStatus.IN_REVIEW]: "bg-yellow-500",
  [TaskStatus.DONE]: "bg-green-500"
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
  [TaskStatus.TODO]: "To Do",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.IN_REVIEW]: "In Review",
  [TaskStatus.DONE]: "Done"
} as const;