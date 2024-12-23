import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function MembershipCTA() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Become a Member</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-6 text-gray-600">
          Join our alumni community to unlock your full profile and access
          exclusive features.
        </p>
        <Link href="/membership">
          <Button className="w-full">Apply for Membership</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
