import { isUserAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await isUserAdmin();

  if (!isAdmin) {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
