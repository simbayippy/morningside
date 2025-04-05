import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Pencil,
  GraduationCap,
  Briefcase,
  Clock,
  BookOpen,
  Building2,
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
    <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.image ?? undefined} />
            <AvatarFallback className="text-xl">
              {getInitials(profile.englishName ?? profile.name ?? "")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-4">
            <div>
              <h2 className="text-3xl font-bold text-[#383590]">
                {profile.englishName ?? profile.name}
              </h2>
              {profile.chineseName && (
                <p className="mt-1 text-lg text-[#383590]/70">
                  {profile.chineseName}
                </p>
              )}
              {profile.preferredName &&
                profile.preferredName !== profile.englishName && (
                  <p className="text-sm text-[#383590]/60">
                    Preferred: {profile.preferredName}
                  </p>
                )}
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.isAdmin && (
                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                    Super Admin
                  </span>
                )}
                {profile.membershipType && (
                  <span className="rounded-full bg-[#F5BC4C]/10 px-3 py-1 text-sm font-medium text-[#F5BC4C]">
                    {profile.membershipType.replace("_", " ")}
                  </span>
                )}
                {profile.isVerified && (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                    Verified Member
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onEditClick}
          className="flex items-center gap-2 border-[#F5BC4C] text-[#F5BC4C] hover:bg-[#F5BC4C]/10"
        >
          <Pencil className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      {/* About Section */}
      <div className="mt-8">
        <h3 className="mb-3 text-lg font-semibold text-[#383590]">About</h3>
        {profile.bio ? (
          <p className="text-[#383590]/70">{profile.bio}</p>
        ) : (
          <p className="italic text-[#383590]/50">
            No bio provided yet. Click edit to add one.
          </p>
        )}
      </div>

      {/* Contact Information */}
      <div className="mt-8">
        <h3 className="mb-3 text-lg font-semibold text-[#383590]">
          Contact Information
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-[#F5BC4C]" />
            <div>
              <p className="text-sm font-medium text-[#383590]/70">Email</p>
              <p className="text-[#383590]">{profile.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-[#F5BC4C]" />
            <div>
              <p className="text-sm font-medium text-[#383590]/70">
                Member Since
              </p>
              <p className="text-[#383590]">{formatDate(profile.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="mt-8">
        <h3 className="mb-3 text-lg font-semibold text-[#383590]">
          Academic Information
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-[#F5BC4C]" />
            <div>
              <p className="text-sm font-medium text-[#383590]/70">Faculty</p>
              <p className="text-[#383590]">{profile.faculty}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-[#F5BC4C]" />
            <div>
              <p className="text-sm font-medium text-[#383590]/70">Major</p>
              <p className="text-[#383590]">{profile.major}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-[#F5BC4C]" />
            <div>
              <p className="text-sm font-medium text-[#383590]/70">Class of</p>
              <p className="text-[#383590]">{profile.class}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Information */}
      {(profile.employer ?? profile.position ?? profile.industry) && (
        <div className="mt-8">
          <h3 className="mb-3 text-lg font-semibold text-[#383590]">
            Professional Information
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            {(profile.employer ?? profile.position) && (
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-[#F5BC4C]" />
                <div>
                  <p className="text-sm font-medium text-[#383590]/70">
                    Current Role
                  </p>
                  <p className="text-[#383590]">
                    {profile.position && (
                      <span className="font-medium">{profile.position}</span>
                    )}
                    {profile.position && profile.employer && " at "}
                    {profile.employer}
                  </p>
                </div>
              </div>
            )}
            {profile.industry && (
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-[#F5BC4C]" />
                <div>
                  <p className="text-sm font-medium text-[#383590]/70">
                    Industry
                  </p>
                  <p className="text-[#383590]">{profile.industry}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
