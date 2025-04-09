import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    redirect("/login");
  }

  return <>{children}</>;
}