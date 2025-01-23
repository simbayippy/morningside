import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="mx-auto w-full max-w-md space-y-6 p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter">
            Verification Failed
          </h1>
          <p className="text-gray-500">
            We were unable to verify your email. This could be because:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>• The verification link has expired</li>
            <li>• The verification link has already been used</li>
            <li>• The verification link is invalid</li>
          </ul>
        </div>

        <div className="flex justify-center">
          <Button asChild>
            <Link href="/signup">Try signing up again</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
