import { useQuery } from "@tanstack/react-query";   

import { client } from "@/lib/rpc";

interface useGetWorkspaceProps {
    workspaceId: string;
}

export const useGetWorkspace = ({
    workspaceId,
}: useGetWorkspaceProps) => {
    const query = useQuery({
        queryKey: ["workspace", workspaceId],
        queryFn: async () => {
            const response = await client.api.workspaces.$get();

            if(!response.ok){
                throw new Error("Failed to fetch workspaces");
            }

            const { data } = await response.json();
            const workspace = data.documents.find((ws: any) => ws.$id === workspaceId);
            
            if (!workspace) {
                throw new Error("Workspace not found");
            }
            
            return workspace;
        },
    });

    return query;
};