import { getCurrent } from "@/features/auth/queries";
import { ProfileView } from "@/features/auth/components/profile-view";
import { redirect } from "next/navigation";

interface ProfilePageProps {
  params: {
    workspaceId: string;
  };
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const user = await getCurrent();
  
  if (!user) redirect("/sign-in");
  
  return <ProfileView user={user} workspaceId={params.workspaceId} />;
};

export default ProfilePage;