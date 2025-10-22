import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { getProject } from "@/features/projects/queries";
import { ProjectSettingsView } from "@/features/projects/components/project-settings-view";

interface ProjectSettingsPageProps{
    params: {
        projectId: string;
        workspaceId: string;
    };
}

const ProjectSettingsPage = async ({
    params,
}: ProjectSettingsPageProps ) => {
    const user = await getCurrent();
    if(!user) redirect("/sign-in");

    const project = await getProject({
        projectId: params.projectId,
    })

    if(!project){
        throw new Error("Project not found or you don't have access to it");
    }

    return (
        <ProjectSettingsView 
            project={project}
            workspaceId={params.workspaceId}
        />
    );
};

export default ProjectSettingsPage;