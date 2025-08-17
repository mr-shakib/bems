import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.members[":memberId"]["$delete"], 200>;
type RequestType = InferRequestType<typeof client.api.members[":memberId"]["$delete"]>;

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ param }) => {
      const response = await client.api.members[":memberId"]["$delete"]({ param });

      if (!response.ok) {
        throw new Error("Member deletion failed");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Member deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["member", data.$id] });
    },
    onError: () => {
      toast.error("Failed to delete member");
    },
  });

  return mutation;
};

