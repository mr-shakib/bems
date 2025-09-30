import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.tasks[":taskId"]["position"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.tasks[":taskId"]["position"]["$patch"]>;

export const useUpdateTaskPosition = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.tasks[":taskId"]["position"]["$patch"]({ 
        param, 
        json 
      });

      if (!response.ok) {
        throw new Error("Failed to update task position");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error("Failed to move task");
    },
  });

  return mutation;
};