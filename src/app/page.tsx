import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import { LandingPage } from "@/components/landing-page";

export default async function Home() {
  const user = await getCurrent();

  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect("/dashboard");
  }

  // Show landing page for unauthenticated users
  return <LandingPage />;
}