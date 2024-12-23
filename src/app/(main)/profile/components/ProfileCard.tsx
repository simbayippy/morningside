import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Pencil,
  GraduationCap,
  Briefcase,
  Clock,
  BookOpen,
  CalendarDays,
} from "lucide-react";
import { getInitials, formatDate } from "@/lib/utils";

interface ProfileData {
  image: string | null;
  name: string | null;
  email: string;
  createdAt: Date;
  isAdmin: boolean;
  membershipType: string | null;
  isVerified: boolean;
  englishName: string | null;
  chineseName: string | null;
  preferredName: string | null;
  bio: string | null;
  major: string | null;
  class: number | null;
  faculty: string | null;
  industry: string | null;
  employer: string | null;
  position: string | null;
}

interface ProfileCardProps {
  profile: ProfileData;
  onEditClick: () => void;
}

export function ProfileCard({ profile, onEditClick }: ProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.image ?? undefined} />
              <AvatarFallback className="text-lg">
                {getInitials(profile.name ?? "")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{profile.name}</CardTitle>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.isAdmin && (
                  <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                    Super Admin
                  </span>
                )}
                {profile.membershipType && (
                  <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                    {profile.membershipType.replace("_", " ")}
                  </span>
                )}
                {profile.isVerified && (
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Verified Member
                  </span>
                )}
              </div>
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
        <div className="space-y-8">
          {/* Bio */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">About</h3>
            {profile.bio ? (
              <p className="text-gray-600">{profile.bio}</p>
            ) : (
              <p className="italic text-gray-400">
                No bio provided yet. Click edit to add one.
              </p>
            )}
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Basic Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{profile.email}</p>
                </div>
              </div>
              {/* Member Since */}
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Member Since
                  </p>
                  <p className="text-gray-900">
                    {formatDate(profile.createdAt)}
                  </p>
                </div>
              </div>
              {/* Chinese Name */}
              {profile.chineseName && (
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Chinese Name
                  </p>
                  <p className="text-gray-900">{profile.chineseName}</p>
                </div>
              )}
              {/* Preferred Name */}
              {profile.preferredName && (
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Preferred Name
                  </p>
                  <p className="text-gray-900">{profile.preferredName}</p>
                </div>
              )}
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Academic Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Faculty</p>
                  <p className="text-gray-900">{profile.faculty}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Major</p>
                  <p className="text-gray-900">{profile.major}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Class of</p>
                  <p className="text-gray-900">{profile.class}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          {(profile.employer ?? profile.position ?? profile.industry) && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">
                Professional Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {(profile.employer ?? profile.position) && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Current Role
                      </p>
                      <p className="text-gray-900">
                        {profile.position && (
                          <span className="font-medium">
                            {profile.position}
                          </span>
                        )}
                        {profile.position && profile.employer && " at "}
                        {profile.employer}
                      </p>
                    </div>
                  </div>
                )}
                {profile.industry && (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-purple-100 p-1">
                      <Briefcase className="h-3 w-3 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Industry
                      </p>
                      <p className="text-gray-900">{profile.industry}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
