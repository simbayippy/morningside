import * as React from "react";
import { api } from "@/trpc/server";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Crown,
  GraduationCap,
  Users,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { redirect } from "next/navigation";
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
    description: "For current students of Morningside College",
    icon: GraduationCap,
    fee: "Free",
    benefits: [
      "Access to alumni events",
      "Student networking opportunities",
      "Career guidance services",
    ],
  },
  ORDINARY_II: {
    title: "Ordinary Member II",
    description: "For recent graduates within 3 years",
    icon: Users,
    fee: "HKD 500",
    benefits: [
      "All student benefits",
      "Alumni directory access",
      "Professional development resources",
    ],
  },
  ORDINARY_I: {
    title: "Ordinary Member I",
    description: "For graduates beyond 3 years",
    icon: Users,
    fee: "HKD 500",
    benefits: [
      "All Ordinary II benefits",
      "Mentorship opportunities",
      "Extended alumni services",
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
  const [currentUser, membership] = await Promise.all([
    getCurrentUser(),
    api.member.getMyMembership(),
  ]);

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1200px] px-8 py-16">
        <div className="mb-12">
          <h1 className="font-mono text-4xl font-bold text-gray-900">
            Alumni Membership
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Join our vibrant alumni community and enjoy exclusive benefits as a
            member of the Morningside College Alumni Association.
          </p>
        </div>

        {/* Current Membership Status */}
        {membership ? (
          <div className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Your Membership Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "rounded-full p-3",
                      membership.status === "REJECTED"
                        ? "bg-red-100"
                        : "bg-purple-100",
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
                            : "text-purple-600",
                        ),
                      },
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {membership.status === "REJECTED"
                        ? "Application Rejected"
                        : membership.isVerified
                          ? membershipTypes[membership.membershipType].title
                          : "Pending Member"}
                    </h3>
                    <p className="text-sm text-gray-600">
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
                        <Button>Apply Again</Button>
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
            <Card>
              <CardHeader>
                <CardTitle>Join Our Alumni Association</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-600">
                  You are not currently a member. Apply now to access exclusive
                  benefits and stay connected with your alma mater.
                </p>
                <Link href="/membership/apply">
                  <Button>Apply for Membership</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Membership Types */}
        <div>
          <h2 className="mb-8 font-mono text-2xl font-bold text-gray-900">
            Membership Types
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(membershipTypes).map(([type, info]) => (
              <Card key={type}>
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                    {React.createElement(info.icon, {
                      className: "h-6 w-6 text-purple-600",
                    })}
                  </div>
                  <CardTitle className="text-xl">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 text-sm text-gray-600">
                    {info.description}
                  </p>
                  <p className="mb-4 font-semibold text-purple-600">
                    {info.fee}
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {info.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                        {benefit}
                      </li>
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
