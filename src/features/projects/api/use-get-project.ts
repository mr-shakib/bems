import { useQuery } from "@tanstack/react-query";   

import { client } from "@/lib/rpc";

interface useGetProjectProps {
    projectId: string;
    workspaceId: string;
}

export const useGetProject = (
    {
        projectId,
        workspaceId,
    }: useGetProjectProps,
    options?: {
        enabled?: boolean;
    }
) => {
    const query = useQuery({
        queryKey: ["project", projectId, workspaceId],
        queryFn: async () => {
            const response = await client.api.projects.$get({
                query: { workspaceId },
            });

            if(!response.ok){
                throw new Error("Failed to fetch projects");
            }

            const { data } = await response.json();
            const project = data.documents.find((p: any) => p.$id === projectId);
            
            if (!project) {
                throw new Error("Project not found");
            }
            
            return project;
        },
        enabled: options?.enabled,
    });

    return query;
};