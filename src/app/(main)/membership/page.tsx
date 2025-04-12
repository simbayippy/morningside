import * as React from "react";
import { api } from "@/trpc/server";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Award,
  Crown,
  GraduationCap,
  Users,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { type MembershipType } from "@prisma/client";
import { cn } from "@/lib/utils";

interface MembershipTypeInfo {
  title: string;
  description: string;
  icon: LucideIcon;
  fee: string;
  benefits: string[];
}

const membershipTypes: Record<MembershipType, MembershipTypeInfo> = {
  STUDENT: {
    title: "Student Member",
    description: "Who is enrolled as a student of the College and has not graduated",
    icon: GraduationCap,
    fee: "Free",
    benefits: [
      "Participate in any activities for the membership class organized by the Association",
      "Attend General Meetings and express opinions",
    ],
  },
  ORDINARY_I: {
    title: "Ordinary Member I",
    description: "Who is a Graduate of the College",
    icon: Award,
    fee: "HKD 500",
    benefits: [
      "Elect and to be elected as an Executive Committee member of the Association",
      "Nominate and be nominated as an Executive Committee member of the Association",
      "Propose resolutions and vote in the General Meeting",
      "Propose amendments to the Constitution",
      "Appoint a Proxy to attend a General Meeting",
    ],
  },
  ORDINARY_II: {
    title: "Ordinary Member II",
    description: "Who has been a student of the College",
    icon: Users,
    fee: "HKD 500",
    benefits: [
      "All benefits of Ordinary Member I",
      "Participate in the Election Committee",
    ],
  },
  HONORARY: {
    title: "Honorary Member",
    description: "Distinguished alumni and contributors",
    icon: Crown,
    fee: "By invitation",
    benefits: [
      "All membership benefits",
      "Special recognition",
      "Exclusive events access",
    ],
  },
};

export default async function MembershipPage() {
  const currentUser = await getCurrentUser();
  const membership = currentUser ? await api.member.getMyMembership() : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1200px] px-8 py-16">
        <div className="mb-12">
          <h1 className="font-mono text-4xl font-bold text-[#383590]">
            Alumni Membership
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[#383590]/70">
            Join our vibrant alumni community and enjoy exclusive benefits as a
            member of the Morningside College Alumni Association.
          </p>
        </div>

        {/* Current Membership Status */}
        {membership ? (
          <div className="mb-12">
            <Card className="border-[#F5BC4C]/20">
              <CardHeader>
                <CardTitle className="text-[#383590]">
                  Your Membership Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "rounded-full p-3",
                      membership.status === "REJECTED"
                        ? "bg-red-100"
                        : "bg-[#F5BC4C]/10",
                    )}
                  >
                    {React.createElement(
                      membership.status === "REJECTED"
                        ? XCircle
                        : membership.isVerified
                          ? membershipTypes[membership.membershipType].icon
                          : GraduationCap,
                      {
                        className: cn(
                          "h-6 w-6",
                          membership.status === "REJECTED"
                            ? "text-red-600"
                            : "text-[#F5BC4C]",
                        ),
                      },
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#383590]">
                      {membership.status === "REJECTED"
                        ? "Application Rejected"
                        : membership.isVerified
                          ? membershipTypes[membership.membershipType].title
                          : "Pending Member"}
                    </h3>
                    <p className="text-sm text-[#383590]/70">
                      {membership.status === "REJECTED"
                        ? "Application rejected on "
                        : "Application submitted on "}{" "}
                      {new Date(
                        membership.dateOfRegistration,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {membership.status === "REJECTED" ? (
                  <div className="mt-4 space-y-4">
                    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
                      <p>
                        We regret to inform you that your membership application
                        has been rejected.
                      </p>
                      {membership.rejectionReason && (
                        <div className="mt-2">
                          <p className="font-medium">Reason for rejection:</p>
                          <p className="mt-1">{membership.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <Link href="/membership/apply">
                        <Button className="bg-[#F5BC4C] text-white hover:bg-[#F5BC4C]/90">
                          Apply Again
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  !membership.isVerified && (
                    <div className="mt-4 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
                      Your membership application (
                      {membershipTypes[membership.membershipType].title}) is
                      pending verification. We will review your application
                      shortly.
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="mb-12">
            <Card className="border-[#F5BC4C]/20">
              <CardHeader>
                <CardTitle className="text-[#383590]">
                  Join Our Alumni Association
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-[#383590]/70">
                  You are not currently a member. Apply now to access exclusive
                  benefits and stay connected with your alma mater.
                </p>
                <Link href="/membership/apply">
                  <Button className="bg-[#F5BC4C] text-white hover:bg-[#F5BC4C]/90">
                    Apply for Membership
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Membership Types */}
        <div>
          <h2 className="mb-8 font-mono text-2xl font-bold text-[#383590]">
            Membership Types
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(membershipTypes).map(([type, info]) => (
              <Card key={type} className="border-[#F5BC4C]/20">
                <CardHeader>
                  <div className="mb-4 flex items-center gap-4">
                    <div className="rounded-full bg-[#F5BC4C]/10 p-3">
                      {React.createElement(info.icon, {
                        className: "h-6 w-6 text-[#F5BC4C]",
                      })}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-[#383590]">
                        {info.title}
                      </CardTitle>
                      <p className="text-sm text-[#383590]/70">{info.fee}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#383590]/70">
                    {info.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="list-inside list-disc space-y-2 text-sm text-[#383590]/70">
                    {info.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
