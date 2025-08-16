import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["$delete"], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["$delete"]>;

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"]["$delete"]({ param });

      if (!response.ok) {
        throw new Error("Workspace deletion failed");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      // Note: We're invalidating the specific workspace query which will no longer exist
      // This is still useful to ensure any related caches are cleared
    },
    onError: () => {
      toast.error("Failed to delete workspace");
    },
  });

  return mutation;
};

