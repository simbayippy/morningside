"use client";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MembershipForm } from "@/components/membership/membership-form";
import type { MembershipFormValues } from "@/lib/schemas/membership";
import type { FACULTY_NAMES } from "@/lib/schemas/membership";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { uploadFile } from "@/lib/upload";

export default function ApplyMembershipPage() {
  const router = useRouter();

  // Get existing membership data if any
  const { data: existingMembership, isLoading } =
    api.member.getMyMembership.useQuery();

  const applyMembership = api.member.submitApplication.useMutation({
    onSuccess: () => {
      toast.success("Membership application submitted successfully", {
        description: "Redirecting back to membership page...",
      });
      router.push("/membership");
      router.refresh();
    },
    onError: (error) => {
      toast.error("Failed to submit membership application", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (values: MembershipFormValues) => {
    try {
      let studentIdImage = values.studentIdImage;
      let paymentImage = values.paymentImage;

      if (values.studentIdImage instanceof File) {
        console.log("Uploading student ID image...");
        const uploadResult = await uploadFile(
          values.studentIdImage,
          "membership",
        );
        studentIdImage = uploadResult.url;
        console.log("Image uploaded successfully:", studentIdImage);
      }

      if (values.paymentImage instanceof File) {
        console.log("Uploading payment proof...");
        const uploadResult = await uploadFile(
          values.paymentImage,
          "membership",
        );
        paymentImage = uploadResult.url;
        console.log("Payment proof uploaded successfully:", paymentImage);
      }

      const formattedValues = {
        ...values,
        class: Number(values.class),
        studentIdImage: studentIdImage as string,
        paymentImage: paymentImage as string,
      };

      console.log(
        "Submitting membership application with data:",
        formattedValues,
      );

      await applyMembership.mutateAsync(formattedValues);
    } catch (error) {
      console.error("Error in membership application:", error);
      if (error instanceof Error) {
        toast.error("Failed to submit membership application", {
          description: error.message,
        });
      } else {
        toast.error("Failed to submit membership application");
      }
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-[1200px] px-8 py-8">
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </div>
        </div>
      </div>
    );
  }

  // Prepare initial form data from existing membership if available
  const initialData = existingMembership
    ? {
        membershipType: existingMembership.membershipType,
        salutation: existingMembership.salutation as
          | "Mr"
          | "Mrs"
          | "Ms"
          | "Dr"
          | "Prof",
        englishName: existingMembership.englishName,
        preferredName: existingMembership.preferredName ?? "",
        chineseName: existingMembership.chineseName ?? "",
        gender: existingMembership.gender as
          | "male"
          | "female"
          | "other"
          | "prefer_not_to_say",
        class: existingMembership.class,
        faculty: existingMembership.faculty as (typeof FACULTY_NAMES)[number],
        major: existingMembership.major,
        cusid: existingMembership.cusid,
        studentIdImage: existingMembership.studentIdImage,
        employer: existingMembership.employer ?? "",
        position: existingMembership.position ?? "",
        phoneNumber: existingMembership.phoneNumber,
        address: existingMembership.address ?? "",
        paymentImage: (existingMembership.paymentImage as string) ?? "",
      }
    : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1200px] px-8 py-8">
        {/* Back Button */}
        <Link
          href="/membership"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Membership
        </Link>

        <MembershipForm
          onSubmit={onSubmit}
          isSubmitting={applyMembership.isPending}
          initialData={initialData}
        />
      </div>
    </div>
  );
}
