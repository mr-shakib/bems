import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";
import { GlobalNavigationLoader } from "@/components/global-navigation-loader";
import { PageTransition } from "@/components/page-transition";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 to-blue-50/20">
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <GlobalNavigationLoader />
        <div className="flex w-full h-full">
            <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto z-40 backdrop-blur-sm">
                <Sidebar/>
            </div>
            <div className="lg:pl-[264px] w-full">
                <div className="mx-auto max-w-screen-2xl h-full">
                    <div className="sticky top-0 z-30 backdrop-blur-md bg-white/80 border-b border-slate-200/50">
                        <Navbar />
                    </div>
                    <main className="h-full py-4 sm:py-6 lg:py-8 px-4 sm:px-6 flex flex-col">
                        <PageTransition className="flex-1">
                            {children}
                        </PageTransition>
                    </main>
                </div>
            </div>
        </div>
    </div>
  );
};

export default DashboardLayout;
