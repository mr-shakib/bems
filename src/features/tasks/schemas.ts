import { z } from "zod";
import { TaskStatus, TaskPriority, TaskType } from "./types";

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, "Task name is required"),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  assigneeId: z.string().min(1, "Please select an assignee"),
  projectId: z.string().min(1, "Please select a project"),
  dueDate: z.string().optional(),
  // Temporarily remove unsupported fields
  // priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  // type: z.nativeEnum(TaskType).default(TaskType.TASK),
  // labels: z.array(z.string()).optional(),
  // estimatedHours: z.number().min(0).optional(),
});

export const updateTaskSchema = z.object({
  name: z.string().trim().min(1, "Name is required").optional(),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  type: z.nativeEnum(TaskType).optional(),
  assigneeId: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  labels: z.array(z.string()).optional(),
  estimatedHours: z.number().min(0).optional(),
});

export const updateTaskPositionSchema = z.object({
  status: z.nativeEnum(TaskStatus),
  position: z.number().min(0),
});

export const getTasksSchema = z.object({
  workspaceId: z.string(),
  projectId: z.string().optional(),
  assigneeId: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  search: z.string().optional(),
});