"use client";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, User, Calendar } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NonMemberEditDialog } from "./NonMemberEditDialog";
import { useState } from "react";
import { toast } from "sonner";

export function NonMemberView() {
  const { data: currentUser, refetch } = api.user.getCurrentUser.useQuery();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully");
      void refetch();
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast.error("Error updating profile", {
        description: error.message,
      });
    },
  });

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1000px] px-8 py-16">
        <h1 className="font-mono text-4xl font-bold text-gray-900">
          My Profile
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          View and manage your profile information
        </p>

        <div className="mt-8 space-y-8">
          {/* User Info Card */}
          <Card className="overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-transparent" />
              <div className="relative p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={currentUser.image ?? undefined} />
                      <AvatarFallback>
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {currentUser.name ?? "Unnamed User"}
                      </h2>
                      <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        {currentUser.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditDialogOpen(true)}
                  >
                    Edit Profile
                  </Button>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-6 border-t pt-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <div className="mt-1">
                      {currentUser.isVerified ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                          Unverified
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Member Type
                    </p>
                    <p className="mt-1 text-sm text-gray-900">Not a Member</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Joined On
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-900">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      {new Date(currentUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Complete Profile Section */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Complete Your Profile
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Join our alumni community to unlock your full profile and access
                exclusive features.
              </p>
            </div>

            <div className="rounded-lg border border-purple-100 bg-purple-50/50 p-4">
              <h3 className="font-medium text-purple-900">
                Benefits of Membership
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-purple-800">
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Access to exclusive alumni events
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Connect with fellow alumni
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Professional networking opportunities
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Stay updated with university news
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Complete profile with academic and professional info
                </li>
              </ul>
            </div>

            <Button className="w-full" size="lg" asChild>
              <Link href="/membership/apply">Apply for Membership</Link>
            </Button>
          </div>
        </div>
      </div>

      <NonMemberEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        profile={{
          englishName: currentUser.name,
          chineseName: null,
          preferredName: null,
          image: currentUser.image,
        }}
        onSubmit={async (values) => {
          await updateProfile.mutateAsync({
            name: values.englishName ?? values.preferredName ?? "Unnamed User",
          });
        }}
        isPending={updateProfile.isPending}
      />
    </div>
  );
}
