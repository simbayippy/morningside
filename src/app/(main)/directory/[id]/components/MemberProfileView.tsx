"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  GraduationCap,
  Briefcase,
  BookOpen,
  CalendarDays,
  ArrowLeft,
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
      <Button variant="ghost" size="sm" asChild>
        <Link href="/directory">
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={member.image ?? undefined} />
              <AvatarFallback className="text-lg">
                {getInitials(member.name ?? "")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{member.name}</CardTitle>
              <div className="mt-2 flex flex-wrap gap-2">
                {member.membershipType && (
                  <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                    {member.membershipType.replace("_", " ")}
                  </span>
                )}
                {member.isVerified && (
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Verified Member
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Bio */}
            {member.bio && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">About</h3>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Contact Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Email */}
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{member.email}</p>
                  </div>
                </div>
                {/* Chinese Name */}
                {member.chineseName && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Chinese Name
                    </p>
                    <p className="text-gray-900">{member.chineseName}</p>
                  </div>
                )}
                {/* Preferred Name */}
                {member.preferredName && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Preferred Name
                    </p>
                    <p className="text-gray-900">{member.preferredName}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">
                Academic Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Faculty</p>
                    <p className="text-gray-900">{member.faculty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Major</p>
                    <p className="text-gray-900">{member.major}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Class of
                    </p>
                    <p className="text-gray-900">{member.class}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            {(member.employer ?? member.position ?? member.industry) && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">
                  Professional Information
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {(member.employer ?? member.position) && (
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Current Role
                        </p>
                        <p className="text-gray-900">
                          {member.position && (
                            <span className="font-medium">
                              {member.position}
                            </span>
                          )}
                          {member.position && member.employer && " at "}
                          {member.employer}
                        </p>
                      </div>
                    </div>
                  )}
                  {member.industry && (
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-purple-100 p-1">
                        <Briefcase className="h-3 w-3 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Industry
                        </p>
                        <p className="text-gray-900">{member.industry}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
