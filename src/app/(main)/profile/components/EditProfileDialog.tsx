"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Upload } from "lucide-react";
import { FACULTIES, type Faculty } from "@/lib/constants/faculties";
import { INDUSTRY_OPTIONS } from "@/lib/constants/industries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const formSchema = z.object({
  englishName: z.string().optional().nullable(),
  chineseName: z.string().optional().nullable(),
  preferredName: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  major: z.string().optional().nullable(),
  class: z.coerce.number().optional().nullable(),
  faculty: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  employer: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: FormValues & { image?: string | null };
  onSubmit: (values: FormValues) => Promise<void>;
  onImageUpload?: (file: File) => Promise<void>;
  isPending: boolean;
}

export function EditProfileDialog({
  open,
  onOpenChange,
  profile,
  onSubmit,
  onImageUpload,
  isPending,
}: EditProfileDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: profile,
  });

  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | undefined>(
    profile.faculty as Faculty | undefined,
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      await onImageUpload(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-[#F5BC4C]/20 sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-[#383590]">Edit Profile</DialogTitle>
          <DialogDescription className="text-[#383590]/70">
            Update your profile information here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.image ?? undefined} />
                  <AvatarFallback>
                    {profile.englishName?.[0] ??
                      profile.preferredName?.[0] ??
                      "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="avatar-upload"
                    onChange={handleImageUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("avatar-upload")?.click()
                    }
                    className="border-[#F5BC4C] text-[#F5BC4C] hover:bg-[#F5BC4C]/10"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="englishName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#383590]">
                        English Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your English name"
                          {...field}
                          value={field.value ?? ""}
                          className="border-[#F5BC4C]/20 focus-visible:ring-[#F5BC4C]"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="chineseName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#383590]">
                        Chinese Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your Chinese name"
                          {...field}
                          value={field.value ?? ""}
                          className="border-[#F5BC4C]/20 focus-visible:ring-[#F5BC4C]"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#383590]">
                        Preferred Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your preferred name"
                          {...field}
                          value={field.value ?? ""}
                          className="border-[#F5BC4C]/20 focus-visible:ring-[#F5BC4C]"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#383590]">Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about yourself"
                          className="min-h-[100px] resize-none border-[#F5BC4C]/20 focus-visible:ring-[#F5BC4C]"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#383590]">
                        Class Year
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter your graduation year"
                          {...field}
                          value={field.value ?? ""}
                          className="border-[#F5BC4C]/20 focus-visible:ring-[#F5BC4C]"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="faculty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#383590]">Faculty</FormLabel>
                      <Select
                        onValueChange={(value: string) => {
                          field.onChange(value);
                          setSelectedFaculty(value as Faculty);
                        }}
                        value={field.value ?? undefined}
                      >
                        <FormControl>
                          <SelectTrigger className="border-[#F5BC4C]/20 text-[#383590] focus:ring-[#F5BC4C]">
                            <SelectValue placeholder="Select your faculty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(FACULTIES).map(
                            ([faculty, majors]) => (
                              <SelectItem
                                key={faculty}
                                value={faculty}
                                className="text-[#383590]"
                              >
                                {faculty}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="major"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#383590]">Major</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your major"
                          {...field}
                          value={field.value ?? ""}
                          className="border-[#F5BC4C]/20 focus-visible:ring-[#F5BC4C]"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="employer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#383590]">Employer</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your employer"
                          {...field}
                          value={field.value ?? ""}
                          className="border-[#F5BC4C]/20 focus-visible:ring-[#F5BC4C]"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#383590]">Position</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your position"
                          {...field}
                          value={field.value ?? ""}
                          className="border-[#F5BC4C]/20 focus-visible:ring-[#F5BC4C]"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#383590]">Industry</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? undefined}
                      >
                        <FormControl>
                          <SelectTrigger className="border-[#F5BC4C]/20 text-[#383590] focus:ring-[#F5BC4C]">
                            <SelectValue placeholder="Select your industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {INDUSTRY_OPTIONS.map((industry) => (
                            <SelectItem
                              key={industry}
                              value={industry}
                              className="text-[#383590]"
                            >
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-[#F5BC4C] text-white hover:bg-[#F5BC4C]/90"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
