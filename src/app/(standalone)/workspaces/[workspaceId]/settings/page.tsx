import { getCurrent } from "@/features/auth/queries";
import { redirect  } from "next/navigation";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { getWorkspace } from "@/features/workspaces/queries";
interface WorkspaceIdSettingsPageProps {
    params: { workspaceId: string };
}

const WorkspaceIdSettingsPage = async ({
    params,
}: WorkspaceIdSettingsPageProps) => {
    const user = await getCurrent();
    if (!user) {
        redirect("/login");
    }

    const initialValues = await getWorkspace({ workspaceId: params.workspaceId });

    if (!initialValues) {
        redirect(`/workspaces/${params.workspaceId}`);
    }

    // Debugging: Log the workspace data to see if inviteCode is present
    console.log("Workspace data:", initialValues);
    console.log("Invite code:", initialValues.inviteCode);

    return (
        <div className="w-full lg:max-w-xl">
            <EditWorkspaceForm initialValues={initialValues} />
        </div>
    );
};

export default WorkspaceIdSettingsPage;
