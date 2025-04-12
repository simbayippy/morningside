"use client";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApplicationTabs } from "./components/ApplicationTabs";
import { RejectDialog } from "./components/RejectDialog";
import { ApproveDialog } from "./components/ApproveDialog";
import { ImagePreviewDialog } from "./components/ImagePreviewDialog";

export default function ApplicationsPage() {
  const router = useRouter();
  const utils = api.useUtils();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedMemberName, setSelectedMemberName] = useState<string>("");
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: applications, isLoading } = api.member.getAllApplications.useQuery();
  console.log("applications", applications);

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
  const pendingApplications = applications?.filter((app) => app.status === "PENDING") ?? [];
  const approvedApplications = applications?.filter((app) => app.status === "APPROVED") ?? [];
  const rejectedApplications = applications?.filter((app) => app.status === "REJECTED") ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="font-mono text-3xl font-bold text-gray-900">
            Membership Applications
          </h1>
        </div>

        {isLoading ? (
          <div className="flex h-[200px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <ApplicationTabs
            pendingApplications={pendingApplications}
            approvedApplications={approvedApplications}
            rejectedApplications={rejectedApplications}
            onApprove={openApproveDialog}
            onReject={openRejectDialog}
            onViewImage={setSelectedImage}
            isProcessing={verifyMembership.isPending || rejectMembership.isPending}
          />
        )}

        <RejectDialog
          open={rejectDialogOpen}
          onOpenChange={setRejectDialogOpen}
          memberName={selectedMemberName}
          reason={rejectionReason}
          onReasonChange={setRejectionReason}
          onConfirm={handleReject}
          isLoading={rejectMembership.isPending}
        />

        <ApproveDialog
          open={approveDialogOpen}
          onOpenChange={setApproveDialogOpen}
          memberName={selectedMemberName}
          onConfirm={handleApprove}
          isLoading={verifyMembership.isPending}
        />

        <ImagePreviewDialog
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      </div>
    </div>
  );
}
