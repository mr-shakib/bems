import { Databases, Query } from "node-appwrite";
import { DATABASE_ID, TASKS_ID, MEMBERS_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { Task, TaskStatus } from "./types";

interface GetTaskProps {
  databases: Databases;
  taskId: string;
  userId: string;
}

export const getTask = async ({ databases, taskId, userId }: GetTaskProps) => {
  const task = await databases.getDocument<Task>(
    DATABASE_ID,
    TASKS_ID,
    taskId
  );

  const member = await getMember({
    databases,
    workspaceId: task.workspaceId,
    userId,
  });

  if (!member) {
    throw new Error("Unauthorized");
  }

  return task;
};

interface CanAccessTaskProps {
  databases: Databases;
  workspaceId: string;
  userId: string;
}

export const canAccessTask = async ({ databases, workspaceId, userId }: CanAccessTaskProps) => {
  const member = await getMember({
    databases,
    workspaceId,
    userId,
  });

  return !!member;
};

export const getNextTaskPosition = async (
  databases: Databases,
  workspaceId: string,
  status: TaskStatus,
  projectId?: string
): Promise<number> => {
  const queries = [
    Query.equal("workspaceId", workspaceId),
    Query.equal("status", status),
    Query.orderDesc("position"),
    Query.limit(1),
  ];

  if (projectId) {
    queries.push(Query.equal("projectId", projectId));
  }

  const tasks = await databases.listDocuments(
    DATABASE_ID,
    TASKS_ID,
    queries
  );

  if (tasks.documents.length === 0) {
    return 1000; // Starting position
  }

  const lastTask = tasks.documents[0] as Task;
  return lastTask.position + 1000;
};