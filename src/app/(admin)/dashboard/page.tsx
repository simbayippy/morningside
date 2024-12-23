"use client";

import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { data: pendingApplications, isLoading } =
    api.member.getPendingApplications.useQuery();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1200px] px-8 py-16">
        <div className="mb-12">
          <h1 className="font-mono text-4xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Manage membership applications and monitor alumni activities.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Membership Applications Card */}
          <Link href="/admin/applications">
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Membership Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </div>
                ) : (
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {pendingApplications?.length ?? 0}
                    </p>
                    <p className="text-sm text-gray-600">
                      Pending applications
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
