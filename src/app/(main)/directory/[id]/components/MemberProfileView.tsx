"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  GraduationCap,
  Briefcase,
  BookOpen,
  ArrowLeft,
  Building2,
} from "lucide-react";
import { getInitials } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MemberData {
  image: string | null;
  name: string | null;
  email: string;
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

interface MemberProfileViewProps {
  member: MemberData;
}

export function MemberProfileView({ member }: MemberProfileViewProps) {
  return (
    <div className="space-y-8">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="text-[#383590]">
          <Link href="/directory" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Directory
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-[#383590]">Alumni Directory</h1>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
        {/* Header Section */}
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24 overflow-hidden">
            <AvatarImage 
              src={member.image ?? undefined} 
              alt={`${member.name}'s profile picture`}
              className="h-full w-full object-cover"
            />
            <AvatarFallback className="text-xl">
              {getInitials(member.name ?? "")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-4">
            <div>
              <h2 className="text-3xl font-bold text-[#383590]">
                {member.name}
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {member.membershipType && (
                  <span className="rounded-full bg-[#F5BC4C]/10 px-3 py-1 text-sm font-medium text-[#F5BC4C]">
                    {member.membershipType.replace("_", " ")}
                  </span>
                )}
                {member.isVerified && (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                    Verified Member
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        {member.bio && (
          <div className="mt-8">
            <h3 className="mb-3 text-lg font-semibold text-[#383590]">About</h3>
            <p className="text-[#383590]/70">{member.bio}</p>
          </div>
        )}

        {/* Contact Information */}
        <div className="mt-8">
          <h3 className="mb-3 text-lg font-semibold text-[#383590]">
            Contact Information
          </h3>
          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-[#F5BC4C]" />
              <div>
                <p className="text-sm font-medium text-[#383590]/70">Email</p>
                <p className="text-[#383590]">{member.email}</p>
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
                <p className="text-[#383590]">{member.faculty}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-[#F5BC4C]" />
              <div>
                <p className="text-sm font-medium text-[#383590]/70">Major</p>
                <p className="text-[#383590]">{member.major}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-[#F5BC4C]" />
              <div>
                <p className="text-sm font-medium text-[#383590]/70">
                  Class of
                </p>
                <p className="text-[#383590]">{member.class}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        {(member.employer ?? member.position ?? member.industry) && (
          <div className="mt-8">
            <h3 className="mb-3 text-lg font-semibold text-[#383590]">
              Professional Information
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              {(member.employer ?? member.position) && (
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-[#F5BC4C]" />
                  <div>
                    <p className="text-sm font-medium text-[#383590]/70">
                      Current Role
                    </p>
                    <p className="text-[#383590]">
                      {member.position && (
                        <span className="font-medium">{member.position}</span>
                      )}
                      {member.position && member.employer && " at "}
                      {member.employer}
                    </p>
                  </div>
                </div>
              )}
              {member.industry && (
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-[#F5BC4C]" />
                  <div>
                    <p className="text-sm font-medium text-[#383590]/70">
                      Industry
                    </p>
                    <p className="text-[#383590]">{member.industry}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
