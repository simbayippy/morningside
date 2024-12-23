"use client";

import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function ApplicationsPage() {
  const router = useRouter();
  const utils = api.useUtils();

  const { data: applications, isLoading } =
    api.member.getPendingApplications.useQuery();

  const verifyMembership = api.member.verifyMembership.useMutation({
    onSuccess: () => {
      toast.success("Membership application approved");
      // Invalidate the pending applications query to refresh the list
      void utils.member.getPendingApplications.invalidate();
      router.refresh();
    },
    onError: (error) => {
      toast.error("Failed to approve application", {
        description: error.message,
      });
    },
  });

  const handleApprove = async (memberId: string) => {
    try {
      await verifyMembership.mutateAsync({
        memberId,
        transactionDate: new Date(),
      });
    } catch (error) {
      console.error("Error approving application:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1200px] px-8 py-8">
        {/* Back Button */}
        <Link
          href="/admin/dashboard"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="font-mono text-3xl font-bold text-gray-900">
            Membership Applications
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Review and process pending membership applications.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading applications...
          </div>
        ) : !applications?.length ? (
          <Card>
            <CardContent className="flex min-h-[200px] items-center justify-center text-gray-500">
              No pending applications
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{application.englishName}</span>
                    <Button
                      onClick={() => handleApprove(application.id)}
                      disabled={verifyMembership.isPending}
                    >
                      {verifyMembership.isPending ? "Processing..." : "Approve"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">
                        Personal Information
                      </p>
                      <div className="space-y-1">
                        <p>
                          <span className="font-medium">Name: </span>
                          {
                            application.salutation
                          } {application.englishName}
                        </p>
                        <p>
                          <span className="font-medium">Gender: </span>
                          {application.gender}
                        </p>
                        <p>
                          <span className="font-medium">Email: </span>
                          {application.user.email}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">
                        Academic Information
                      </p>
                      <div className="space-y-1">
                        <p>
                          <span className="font-medium">Faculty: </span>
                          {application.faculty}
                        </p>
                        <p>
                          <span className="font-medium">Major: </span>
                          {application.major}
                        </p>
                        <p>
                          <span className="font-medium">Class: </span>
                          {application.class}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">
                        Application Details
                      </p>
                      <div className="space-y-1">
                        <p>
                          <span className="font-medium">Membership Type: </span>
                          {application.membershipType}
                        </p>
                        <p>
                          <span className="font-medium">Applied on: </span>
                          {formatDate(application.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">
                        Contact Information
                      </p>
                      <div className="space-y-1">
                        <p>
                          <span className="font-medium">Phone: </span>
                          {application.phoneNumber}
                        </p>
                        {application.address && (
                          <p>
                            <span className="font-medium">Address: </span>
                            {application.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-500">
                      Student ID Image
                    </p>
                    <img
                      src={application.studentIdImage}
                      alt="Student ID"
                      className="mt-2 max-h-[200px] rounded-lg object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
