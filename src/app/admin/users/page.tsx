"use client";

import { api } from "@/trpc/react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRoleActions } from "@/components/admin/user-role-actions";
import { ArrowLeft, Loader2, Shield, User } from "lucide-react";
import Link from "next/link";

export default function UsersPage() {
  const { data: currentUser, isLoading: isLoadingUser } =
    api.user.getCurrentUser.useQuery();
  const { data: users, isLoading: isLoadingUsers } =
    api.user.getAllUsers.useQuery();

  const isLoading = isLoadingUser || isLoadingUsers;

  if (!currentUser || !users) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1200px] px-8 py-8">
        {/* Back Button */}
        <Link
          href="/admin/dashboard"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="font-mono text-3xl font-bold text-gray-900">
            User Management
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Manage user roles and permissions.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading users...
          </div>
        ) : (
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name ?? "User"}
                            className="h-6 w-6 rounded-full"
                          />
                        ) : (
                          <User className="h-6 w-6 text-gray-400" />
                        )}
                        {user.name ?? "Unnamed User"}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.isSuperAdmin ? (
                          <div className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                            <Shield className="h-3 w-3" />
                            Super Admin
                          </div>
                        ) : user.isAdmin ? (
                          <div className="flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
                            <Shield className="h-3 w-3" />
                            Admin
                          </div>
                        ) : (
                          <div className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                            User
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <UserRoleActions user={user} currentUser={currentUser} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </div>
  );
}
