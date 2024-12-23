import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Pencil } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { MembershipCTA } from "./MembershipCTA";
import { ProfileHeader } from "./ProfileHeader";

interface NonMemberViewProps {
  onEditClick: () => void;
}

export function NonMemberView({ onEditClick }: NonMemberViewProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1000px] px-8 py-16">
        <ProfileHeader
          title="My Profile"
          description="Complete your profile by becoming a member"
        />

        <div className="grid gap-8 md:grid-cols-3">
          {/* Basic Profile Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={undefined} />
                    <AvatarFallback className="text-lg">
                      {getInitials("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">Unnamed User</CardTitle>
                    <div className="mt-2 flex gap-2"></div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEditClick}
                  className="flex items-center gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">Not available</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Membership CTA Card */}
          <MembershipCTA />
        </div>
      </div>
    </div>
  );
}
