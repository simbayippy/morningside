"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const newsFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must be less than 100 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),
  content: z
    .string()
    .min(1, "Content is required")
    .max(10000, "Content must be less than 10000 characters"),
  summary: z
    .string()
    .min(1, "Summary is required")
    .max(300, "Summary must be less than 300 characters"),
  imageUrl: z.union([z.string().url(), z.instanceof(File)]),
});

export type NewsFormValues = z.infer<typeof newsFormSchema>;

interface NewsFormProps {
  initialData?: {
    title: string;
    slug: string;
    content: string;
    summary: string;
    imageUrl: string;
  } | null;
  onSubmit: (values: NewsFormValues) => void;
  isSubmitting?: boolean;
  submitLabel: string;
}

export function NewsForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitLabel,
}: NewsFormProps) {
  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      content: initialData?.content ?? "",
      summary: initialData?.summary ?? "",
      imageUrl: initialData?.imageUrl ?? "",
    },
  });

  // Auto-generate slug when title changes
  const titleField = form.watch("title");
  React.useEffect(() => {
    if (titleField) {
      const slug = titleField
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      form.setValue("slug", slug);
    }
  }, [titleField, form]);

  const isEdit = !!initialData;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="rounded-xl bg-white shadow-md">
          {/* Header */}
          <div className="border-b border-gray-200 px-8 py-6">
            <h1 className="font-mono text-2xl font-bold text-gray-900">
              {isEdit ? "Edit News Article" : "Create New Article"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isEdit
                ? "Update the details of your article"
                : "Fill in the details to create a new article"}
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-8 px-8 py-6">
            {/* Basic Info Section */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Article Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a descriptive title"
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
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a brief summary that will appear in previews"
                        className="h-20 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Content Section */}
            <div className="space-y-6">
              <h2 className="font-semibold text-gray-900">Article Content</h2>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your article content here"
                        className="min-h-[300px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-6">
              <h2 className="font-semibold text-gray-900">Cover Image</h2>

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-purple-600" />
                        Upload Image
                      </div>
                    </FormLabel>
                    <FormControl>
                      <div className="max-w-[500px] overflow-hidden rounded-lg border border-gray-200">
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                  <span>
                    {submitLabel === "Create Article"
                      ? "Creating..."
                      : "Updating..."}
                  </span>
                </div>
              ) : (
                submitLabel
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
