"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  membershipFormSchema,
  type MembershipFormValues,
} from "@/lib/schemas/membership";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Building2, GraduationCap, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { FACULTIES } from "@/lib/constants/faculties";
import { useEffect } from "react";
import { FileUpload } from "@/components/ui/file-upload";

interface MembershipFormProps {
  onSubmit: (values: MembershipFormValues) => Promise<void>;
  isSubmitting?: boolean;
  initialData?: MembershipFormValues;
}

export function MembershipForm({
  onSubmit,
  isSubmitting = false,
  initialData,
}: MembershipFormProps) {
  const form = useForm<MembershipFormValues>({
    resolver: zodResolver(membershipFormSchema),
    defaultValues: initialData ?? {
      membershipType: "STUDENT",
      salutation: undefined,
      englishName: "",
      preferredName: "",
      chineseName: "",
      gender: undefined,
      class: new Date().getFullYear(), // Default to current year
      faculty: undefined,
      major: undefined,
      cusid: "",
      studentIdImage: "",
      employer: "",
      position: "",
      phoneNumber: "",
      address: "",
    },
  });

  // Watch faculty field to update majors
  const selectedFaculty = form.watch("faculty");

  // Reset major when faculty changes
  useEffect(() => {
    if (selectedFaculty && !initialData) {
      form.setValue("major", "");
    }
  }, [selectedFaculty, form, initialData]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="rounded-xl bg-white shadow-md">
          {/* Header */}
          <div className="border-b border-gray-200 px-8 py-6">
            <h1 className="font-mono text-2xl font-bold text-gray-900">
              {initialData
                ? "Update Membership Application"
                : "Membership Application"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {initialData
                ? "Update your details to resubmit your MCAA membership application"
                : "Fill in your details to apply for MCAA membership"}
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-8 px-8 py-6">
            {/* Membership Type Section */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="membershipType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Membership Type*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select membership type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="STUDENT">Student</SelectItem>
                        <SelectItem value="ORDINARY_II">Ordinary II</SelectItem>
                        <SelectItem value="ORDINARY_I">Ordinary I</SelectItem>
                        <SelectItem value="HONORARY">Honorary</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Personal Information Section */}
            <div className="space-y-6">
              <h2 className="font-semibold text-gray-900">
                Personal Information
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="salutation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-purple-600" />
                          Salutation*
                        </div>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select salutation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Mr">Mr.</SelectItem>
                          <SelectItem value="Mrs">Mrs.</SelectItem>
                          <SelectItem value="Ms">Ms.</SelectItem>
                          <SelectItem value="Dr">Dr.</SelectItem>
                          <SelectItem value="Prof">Prof.</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="englishName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-purple-600" />
                          English Name*
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your English name"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="preferredName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Name (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your preferred name"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="chineseName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chinese Name (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your Chinese name"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Academic Information Section */}
            <div className="space-y-6">
              <h2 className="font-semibold text-gray-900">
                Academic Information
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="cusid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-purple-600" />
                          Student ID*
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your student ID"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-purple-600" />
                          Class Year*
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter your class year"
                          className="h-12"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="faculty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-purple-600" />
                          Faculty*
                        </div>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select faculty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(FACULTIES).map((faculty) => (
                            <SelectItem key={faculty} value={faculty}>
                              {faculty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="major"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-purple-600" />
                          Major*
                        </div>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!selectedFaculty}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                selectedFaculty
                                  ? "Select major"
                                  : "Please select a faculty first"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedFaculty &&
                            FACULTIES[selectedFaculty].map((major) => (
                              <SelectItem key={major} value={major}>
                                {major}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="studentIdImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-purple-600" />
                      Student ID Card Image*
                    </div>
                  </FormLabel>
                  <FormControl>
                    <div className="max-w-[500px] overflow-hidden rounded-lg border border-gray-200">
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Professional Information Section */}
            <div className="space-y-6">
              <h2 className="font-semibold text-gray-900">
                Professional Information (Optional)
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="employer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-purple-600" />
                          Employer
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your employer"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-purple-600" />
                          Position
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your position"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-6">
              <h2 className="font-semibold text-gray-900">
                Contact Information
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-purple-600" />
                          Phone Number*
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Enter your phone number"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-purple-600" />
                          Address (Optional)
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your address"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="border-t border-gray-200 px-8 py-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(isSubmitting && "cursor-not-allowed opacity-50")}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Submitting...</span>
                </div>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
