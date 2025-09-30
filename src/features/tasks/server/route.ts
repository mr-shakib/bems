import { Hono } from "hono";
import { z } from "zod";
import { Query, ID } from "node-appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { createAdminClient } from "@/lib/appwrite";
import { DATABASE_ID, TASKS_ID, PROJECTS_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { Task, TaskStatus } from "../types";
import { 
  createTaskSchema, 
  updateTaskSchema, 
  getTasksSchema,
  updateTaskPositionSchema 
} from "../schemas";
import { getNextTaskPosition, canAccessTask } from "../utils";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", getTasksSchema),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId, projectId, assigneeId, status, search } = c.req.valid("query");

      // Check if user can access this workspace
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const queries = [Query.equal("workspaceId", workspaceId)];

      if (projectId) {
        queries.push(Query.equal("projectId", projectId));
      }

      if (status) {
        queries.push(Query.equal("status", status));
      }

      if (assigneeId) {
        queries.push(Query.equal("assigneeId", assigneeId));
      }

      if (search) {
        queries.push(Query.search("name", search));
      }

      queries.push(Query.orderDesc("$createdAt"));

      const tasks = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        queries
      );

      // Populate assignee information
      const populatedTasks = await Promise.all(
        tasks.documents.map(async (task) => {
          const assignee = task.assigneeId 
            ? await users.get(task.assigneeId).catch(() => null)
            : null;

          return {
            ...task,
            assignee: assignee ? {
              $id: assignee.$id,
              name: assignee.name,
              email: assignee.email,
            } : null,
          };
        })
      );

      return c.json({
        data: {
          ...tasks,
          documents: populatedTasks,
        },
      });
    }
  )
  .get(
    "/:taskId",
    sessionMiddleware,
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");
      const { taskId } = c.req.param();

      const task = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId
      );

      const member = await getMember({
        databases,
        workspaceId: task.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Populate assignee information
      const assignee = task.assigneeId 
        ? await users.get(task.assigneeId).catch(() => null)
        : null;

      const populatedTask = {
        ...task,
        assignee: assignee ? {
          $id: assignee.$id,
          name: assignee.name,
          email: assignee.email,
        } : null,
      };

      return c.json({ data: populatedTask });
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { name, description, status, assigneeId, projectId, dueDate } = c.req.valid("json");

      // Get project to verify workspace access
      const project = await databases.getDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      );

      const member = await getMember({
        databases,
        workspaceId: project.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Get next position for the status column
      const position = await getNextTaskPosition(
        databases,
        project.workspaceId,
        status,
        projectId
      );

      const task = await databases.createDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          name,
          description: description || "",
          status,
          assigneeId: assigneeId || user.$id, // Default to current user if no assignee specified
          projectId,
          workspaceId: project.workspaceId,
          dueDate: dueDate || "", // Provide empty string as default
          position,
          // Remove createdBy field as database doesn't support it
        }
      );

      return c.json({ data: task });
    }
  )
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", updateTaskSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { taskId } = c.req.param();
      const updates = c.req.valid("json");

      const existingTask = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId
      );

      const member = await getMember({
        databases,
        workspaceId: existingTask.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const task = await databases.updateDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId,
        updates
      );

      return c.json({ data: task });
    }
  )
  .patch(
    "/:taskId/position",
    sessionMiddleware,
    zValidator("json", updateTaskPositionSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { taskId } = c.req.param();
      const { status, position } = c.req.valid("json");

      const existingTask = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId
      );

      const member = await getMember({
        databases,
        workspaceId: existingTask.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const task = await databases.updateDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId,
        {
          status,
          position,
        }
      );

      return c.json({ data: task });
    }
  )
  .delete(
    "/:taskId",
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { taskId } = c.req.param();

      const existingTask = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId
      );

      const member = await getMember({
        databases,
        workspaceId: existingTask.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      await databases.deleteDocument(
        DATABASE_ID,
        TASKS_ID,
        taskId
      );

      return c.json({ data: { $id: taskId } });
    }
  );

export default app;