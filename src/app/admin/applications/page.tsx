"use client";

import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ApplicationsPage() {
  const router = useRouter();
  const utils = api.useUtils();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedMemberName, setSelectedMemberName] = useState<string>("");
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: applications, isLoading } =
    api.member.getAllApplications.useQuery();

  const verifyMembership = api.member.verifyMembership.useMutation({
    onSuccess: () => {
      toast.success("Membership application approved");
      void utils.member.getAllApplications.invalidate();
      router.refresh();
      setApproveDialogOpen(false);
      setSelectedMemberId(null);
      setSelectedMemberName("");
    },
    onError: (error) => {
      toast.error("Failed to approve application", {
        description: error.message,
      });
    },
  });

  const rejectMembership = api.member.rejectMembership.useMutation({
    onSuccess: () => {
      toast.success("Membership application rejected");
      void utils.member.getAllApplications.invalidate();
      router.refresh();
      setRejectDialogOpen(false);
      setRejectionReason("");
      setSelectedMemberId(null);
      setSelectedMemberName("");
    },
    onError: (error) => {
      toast.error("Failed to reject application", {
        description: error.message,
      });
    },
  });

  const handleApprove = async () => {
    if (!selectedMemberId) return;
    try {
      await verifyMembership.mutateAsync({
        memberId: selectedMemberId,
        transactionDate: new Date(),
      });
    } catch (error) {
      console.error("Error approving application:", error);
    }
  };

  const handleReject = async () => {
    if (!selectedMemberId) return;
    try {
      await rejectMembership.mutateAsync({
        memberId: selectedMemberId,
        reason: rejectionReason,
      });
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  const openRejectDialog = (memberId: string, memberName: string) => {
    setSelectedMemberId(memberId);
    setSelectedMemberName(memberName);
    setRejectDialogOpen(true);
  };

  const openApproveDialog = (memberId: string, memberName: string) => {
    setSelectedMemberId(memberId);
    setSelectedMemberName(memberName);
    setApproveDialogOpen(true);
  };

  // Filter applications by status
  const pendingApplications =
    applications?.filter((app) => app.status === "PENDING") ?? [];
  const approvedApplications =
    applications?.filter((app) => app.status === "APPROVED") ?? [];
  const rejectedApplications =
    applications?.filter((app) => app.status === "REJECTED") ?? [];

  const renderApplications = (filteredApplications: typeof applications) => {
    if (!filteredApplications?.length) {
      return (
        <Card>
          <CardContent className="flex min-h-[200px] items-center justify-center text-gray-500">
            No applications found
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {filteredApplications.map((application) => (
          <Card key={application.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{application.englishName}</span>
                {application.status === "PENDING" && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        openRejectDialog(
                          application.id,
                          application.englishName,
                        )
                      }
                      disabled={
                        verifyMembership.isPending || rejectMembership.isPending
                      }
                      className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                    >
                      {rejectMembership.isPending ? "Processing..." : "Reject"}
                    </Button>
                    <Button
                      onClick={() =>
                        openApproveDialog(
                          application.id,
                          application.englishName,
                        )
                      }
                      disabled={
                        verifyMembership.isPending || rejectMembership.isPending
                      }
                    >
                      {verifyMembership.isPending ? "Processing..." : "Approve"}
                    </Button>
                  </div>
                )}
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
                      {application.salutation} {application.englishName}
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
                    {application.status === "REJECTED" &&
                      application.rejectionReason && (
                        <p>
                          <span className="font-medium">
                            Rejection Reason:{" "}
                          </span>
                          <span className="text-red-600">
                            {application.rejectionReason}
                          </span>
                        </p>
                      )}
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
                <button
                  onClick={() => setSelectedImage(application.studentIdImage)}
                  className="mt-2 overflow-hidden rounded-lg transition-opacity hover:opacity-80"
                >
                  <img
                    src={application.studentIdImage}
                    alt="Student ID"
                    className="max-h-[200px] object-cover"
                  />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
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
            Review and manage membership applications.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading applications...
          </div>
        ) : (
          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList>
              <TabsTrigger value="pending" className="relative">
                Pending
                {pendingApplications.length > 0 && (
                  <span className="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600">
                    {pendingApplications.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved
                {approvedApplications.length > 0 && (
                  <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">
                    {approvedApplications.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected
                {rejectedApplications.length > 0 && (
                  <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                    {rejectedApplications.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-6">
              {renderApplications(pendingApplications)}
            </TabsContent>

            <TabsContent value="approved" className="mt-6">
              {renderApplications(approvedApplications)}
            </TabsContent>

            <TabsContent value="rejected" className="mt-6">
              {renderApplications(rejectedApplications)}
            </TabsContent>
          </Tabs>
        )}

        {/* Alert Dialogs */}
        {/* ... existing alert dialogs ... */}
      </div>
    </div>
  );
}
