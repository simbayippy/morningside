"use client";

import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import {
  ArrowLeft,
  Loader2,
  GraduationCap,
  Briefcase,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";

interface AlumniProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AlumniProfilePage({ params }: AlumniProfilePageProps) {
  // Await the params object before destructuring
  const { id } = use(params);

  // Get the alumni's details
  const { data: alumni, isLoading: alumniLoading } =
    api.member.getMemberById.useQuery({ memberId: id });

  // Loading state
  if (alumniLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  // If alumni not found
  if (!alumni) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-[1000px] px-8 py-16">
          <Link
            href="/directory"
            className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Directory
          </Link>

          <Card>
            <CardContent className="flex min-h-[200px] items-center justify-center text-gray-500">
              Alumni not found
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1000px] px-8 py-16">
        {/* Back Button */}
        <Link
          href="/directory"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Directory
        </Link>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Profile Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={alumni.user.image ?? undefined} />
                  <AvatarFallback className="text-lg">
                    {getInitials(alumni.englishName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">
                    {alumni.salutation} {alumni.englishName}
                    {alumni.chineseName && (
                      <span className="ml-2 text-gray-500">
                        ({alumni.chineseName})
                      </span>
                    )}
                  </CardTitle>
                  <div className="mt-2 flex gap-2">
                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-600">
                      {alumni.membershipType === "STUDENT"
                        ? "Student Member"
                        : alumni.membershipType === "ORDINARY_II"
                          ? "Ordinary Member II"
                          : alumni.membershipType === "ORDINARY_I"
                            ? "Ordinary Member I"
                            : "Honorary Member"}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Academic Information */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">
                    Academic Information
                  </h3>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-600">
                      <GraduationCap className="h-4 w-4" />
                      <span>
                        {alumni.faculty} - Class of {alumni.class}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      <span className="font-medium">Major: </span>
                      {alumni.major}
                    </p>
                  </div>
                </div>

                {/* Professional Information */}
                {(alumni.employer ?? alumni.position) && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">
                      Professional Information
                    </h3>
                    <div className="space-y-1">
                      {alumni.employer && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Briefcase className="h-4 w-4" />
                          <span>
                            {alumni.position ? `${alumni.position} at ` : ""}
                            {alumni.employer}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">
                    Contact Information
                  </h3>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{alumni.user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{alumni.phoneNumber}</span>
                    </div>
                    {alumni.address && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{alumni.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Member Since</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {new Date(alumni.dateOfRegistration).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
