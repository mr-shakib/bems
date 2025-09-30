import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { getProject } from "@/features/projects/queries";
import { ProjectTasksView } from "@/features/projects/components/project-tasks-view-new";

interface ProjectIdPageProps{
    params: {
        projectId: string;
        workspaceId: string;
    };
}

const ProjectIdPage = async ({
    params,
}: ProjectIdPageProps ) => {
    const user = await getCurrent();
    if(!user) redirect("/sign-in");

    const initialValues = await getProject({
        projectId: params.projectId,
    })

    if(!initialValues){
        throw new Error("Project not found or you don't have access to it");
    }

    return (
        <ProjectTasksView 
            project={initialValues}
            workspaceId={params.workspaceId}
        />
    );
};

export default ProjectIdPage;