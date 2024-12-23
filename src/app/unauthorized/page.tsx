import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center">
      <div className="text-center">
        <ShieldAlert className="mx-auto h-16 w-16 text-destructive" />
        <h1 className="mt-6 text-3xl font-bold">Unauthorized Access</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          You don&apos;t have permission to access this page.
        </p>
        <div className="mt-8">
          <Link href="/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
