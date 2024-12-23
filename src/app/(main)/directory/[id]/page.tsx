"use client";

import { api } from "@/trpc/react";
import { MemberProfileView } from "./components/MemberProfileView";
import { Loader2 } from "lucide-react";
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

  if (!alumni) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-muted-foreground">Member not found</div>
      </div>
    );
  }

  // Transform the data to match MemberData interface
  const memberData = {
    image: alumni.user!.image,
    name: alumni.englishName,
    email: alumni.user!.email,
    membershipType: alumni.membershipType,
    isVerified: alumni.isVerified,
    englishName: alumni.englishName,
    chineseName: alumni.chineseName,
    preferredName: alumni.preferredName,
    bio: alumni.bio,
    major: alumni.major,
    class: alumni.class,
    faculty: alumni.faculty,
    industry: alumni.industry,
    employer: alumni.employer,
    position: alumni.position,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1000px] px-8 py-16">
        <MemberProfileView member={memberData} />
      </div>
    </div>
  );
}
