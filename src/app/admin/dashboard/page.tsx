"use client";

import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, PlusCircle, Shield, Calendar } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { data: currentUser, isLoading: isLoadingUser } =
    api.user.getCurrentUser.useQuery();
  const { data: pendingApplications, isLoading: isLoadingApplications } =
    api.member.getPendingApplications.useQuery();

  const isLoading = isLoadingUser || isLoadingApplications;

  if (!currentUser) return null;

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
          <Link href="/admin/applications" className="block h-full">
            <Card className="h-full transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Membership Applications</CardTitle>
                <p className="text-sm text-gray-600">
                  Review and manage membership applications
                </p>
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

          {/* Event Registrations Card */}
          <Link href="/admin/events" className="block h-full">
            <Card className="h-full transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Event Registrations</CardTitle>
                <p className="text-sm text-gray-600">
                  View and manage event registrations
                </p>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-2xl font-bold text-orange-600">Events</p>
                  <p className="text-sm text-gray-600">View registrations</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Create Content Card */}
          <Link href="/admin/create" className="block h-full">
            <Card className="h-full transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <PlusCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Create Content</CardTitle>
                <p className="text-sm text-gray-600">
                  Create events, news, and other content
                </p>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    News / Events
                  </p>
                  <p className="text-sm text-gray-600">Add new content</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* User Management Card */}
          <Link href="/admin/users" className="block h-full">
            <Card className="h-full transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>
                  {currentUser.isSuperAdmin ? "User Management" : "User List"}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {currentUser.isSuperAdmin
                    ? "Manage user roles and permissions - Add, remove & adjust permissions"
                    : "View list of registered users and their details"}
                </p>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    Users / Roles
                  </p>
                  <p className="text-sm text-gray-600">
                    {currentUser.isSuperAdmin
                      ? "Manage admin access"
                      : "View users"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
