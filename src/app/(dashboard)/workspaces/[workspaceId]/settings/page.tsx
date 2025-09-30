import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { getWorkspace } from "@/features/workspaces/queries";

interface WorkspaceIdSettingsPageProps {
  params: { 
    workspaceId: string;
  };
}

const WorkspaceIdSettingsPage = async ({
  params,
}: WorkspaceIdSettingsPageProps) => {
  const user = await getCurrent();
  
  if (!user) {
    redirect("/sign-in");
  }

  const initialValues = await getWorkspace({ workspaceId: params.workspaceId });

  if (!initialValues) {
    redirect(`/workspaces/${params.workspaceId}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Main Content Card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-8">
            <EditWorkspaceForm initialValues={initialValues} />
          </div>
        </div>

        {/* Footer Helper Text */}
        <div className="mt-6 rounded-lg bg-slate-50 px-4 py-3 border border-slate-100">
          <p className="text-xs text-slate-500">
            Changes to your workspace settings will be applied immediately and visible to all members.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceIdSettingsPage;