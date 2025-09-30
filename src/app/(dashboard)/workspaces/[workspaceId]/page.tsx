import { getCurrent } from "@/features/auth/queries";
import { getWorkspace } from "@/features/workspaces/queries";
import { WorkspaceDashboard } from "@/features/workspaces/components/workspace-dashboard";
import { redirect } from "next/navigation";

interface WorkspaceIdPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkspaceIdPage = async ({ params }: WorkspaceIdPageProps) => {
  const user = await getCurrent();
  
  if (!user) redirect("/sign-in");
  
  const workspace = await getWorkspace({
    workspaceId: params.workspaceId,
  });
  
  if (!workspace) {
    throw new Error("Workspace not found or you don't have access to it");
  }
  
  return (
    <WorkspaceDashboard 
      workspaceId={params.workspaceId}
      workspaceName={workspace.name}
    />
  );
};

export default WorkspaceIdPage;