"use client";

import { api } from "@/trpc/react";
import { useState } from "react";
import { EditProfileDialog } from "./components/EditProfileDialog";
import { NonMemberView } from "./components/NonMemberView";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileCard } from "./components/ProfileCard";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const utils = api.useUtils();
  const { data: profile, isLoading } = api.member.getMyProfile.useQuery();
  const { mutate: updateProfile, isPending } =
    api.member.updateProfile.useMutation({
      onSuccess: () => {
        setIsEditing(false);
        void utils.member.getMyProfile.invalidate();
      },
    });

  const { mutate: updateUserImage, isPending: isImageUploading } =
    api.member.updateUserImage.useMutation({
      onSuccess: () => {
        void utils.member.getMyProfile.invalidate();
      },
    });

  const handleImageUpload = async (file: File) => {
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Image = reader.result as string;
        updateUserImage({ image: base64Image });
      };
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  if (!profile) {
    return <NonMemberView onEditClick={() => setIsEditing(true)} />;
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (values: {
    englishName?: string | null;
    chineseName?: string | null;
    preferredName?: string | null;
    bio?: string | null;
    major?: string | null;
    class?: number | null;
    faculty?: string | null;
    industry?: string | null;
    employer?: string | null;
    position?: string | null;
  }) => {
    updateProfile(values);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1000px] px-8 py-16">
        <ProfileHeader
          title="My Profile"
          description="View and manage your profile information"
        />

        <div className="space-y-8">
          <ProfileCard profile={profile} onEditClick={handleEditClick} />
        </div>
      </div>

      <EditProfileDialog
        open={isEditing}
        onOpenChange={setIsEditing}
        profile={{
          englishName: profile.englishName,
          chineseName: profile.chineseName,
          preferredName: profile.preferredName,
          bio: profile.bio,
          major: profile.major,
          class: profile.class,
          faculty: profile.faculty,
          industry: profile.industry,
          employer: profile.employer,
          position: profile.position,
          image: profile.image,
        }}
        onSubmit={handleSubmit}
        onImageUpload={handleImageUpload}
        isPending={isPending || isImageUploading}
      />
    </div>
  );
}
