import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { TaskStatus } from "../types";

interface UseGetTasksProps {
  workspaceId: string;
  projectId?: string;
  assigneeId?: string;
  status?: TaskStatus;
  search?: string;
}

export const useGetTasks = ({ 
  workspaceId, 
  projectId, 
  assigneeId, 
  status, 
  search 
}: UseGetTasksProps) => {
  return useQuery({
    queryKey: ["tasks", workspaceId, projectId, assigneeId, status, search],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          ...(projectId && { projectId }),
          ...(assigneeId && { assigneeId }),
          ...(status && { status }),
          ...(search && { search }),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const { data } = await response.json();
      return data;
    },
  });
};