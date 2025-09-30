import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { getWorkspace } from "@/features/workspaces/queries";
import { Settings } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 text-gray-600 flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Workspace Settings
                </h1>
                <p className="text-sm text-gray-600">
                  Manage workspace preferences and access controls
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Main Settings Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <EditWorkspaceForm initialValues={initialValues} />
            </div>
          </div>

          {/* Info Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Stats Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 text-gray-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 12h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="font-medium text-gray-900">Workspace Info</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Created:</span> Recently</p>
                <p><span className="font-medium">Members:</span> {initialValues.members?.length || 1}</p>
                <p><span className="font-medium">Projects:</span> Active</p>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 text-gray-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="font-medium text-gray-900">Pro Tips</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Keep workspace names clear</p>
                <p>• Use high-quality images for branding</p>
                <p>• Rotate invite links periodically</p>
              </div>
            </div>
          </div>

          {/* Footer Helper Text */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 px-4 py-3">
            <div className="flex items-start space-x-3">
              <div className="w-4 h-4 text-gray-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-2 h-2 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">Important Notes</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Changes to workspace settings apply immediately and are visible to members. Some updates may take a few moments to propagate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceIdSettingsPage;