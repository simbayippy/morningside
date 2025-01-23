import { getCurrentUser } from "@/lib/auth";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function DirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // If not logged in, redirect to login page
  if (!user) {
    redirect("/login?callbackUrl=/directory");
  }

  // Check if user is a verified member using tRPC
  const membership = await api.member.getMyMembership();

  if (!membership?.isVerified) {
    redirect("/membership");
  }

  return <>{children}</>;
}
