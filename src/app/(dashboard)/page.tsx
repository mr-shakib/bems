import {redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/actions";
import { getWorkspaces } from "@/features/workspaces/actions";

export default async function Home() {

  const user = await getCurrent();

  if(!user) redirect("/sign-in");

  const workspaces = await getWorkspaces();
  const total = 'total' in workspaces ? workspaces.total : workspaces.data.total;
  const documents = 'documents' in workspaces ? workspaces.documents : workspaces.data.documents;
  
  if(total === 0) {
    redirect("/workspaces/create");
  }else{
    redirect(`/workspaces/${documents[0].$id}`);
  }

};
