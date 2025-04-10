"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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
import { ImageIcon, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

const newsFormSchema = z.object({
  publishedAt: z.date({required_error: "Please select a date"}),
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
  imageUrls: z.array(z.union([z.string().url(), z.instanceof(File)])).min(1, "At least one image is required"),
});

export type NewsFormValues = z.infer<typeof newsFormSchema>;

interface NewsFormProps {
  initialData?: {
    title: string;
    slug: string;
    content: string;
    summary: string;
    imageUrls: string[];
    publishedAt: Date;
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
      imageUrls: initialData?.imageUrls ?? [],
      publishedAt: initialData?.publishedAt ?? new Date(),
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

  // Multiple File Upload Field Component
  function MultipleFileUploadField({
    value,
    onChange,
  }: {
    value: (string | File)[];
    onChange: (value: (string | File)[]) => void;
  }) {
    const [previewUrls, setPreviewUrls] = useState<{ id: number; url: string }[]>([]);
  
    // Cleanup URLs on unmount
    useEffect(() => {
      return () => {
        previewUrls.forEach(preview => {
          if (preview.url.startsWith('blob:')) {
            URL.revokeObjectURL(preview.url);
          }
        });
      };
    }, [previewUrls]);

    // Update preview URLs when value changes
    useEffect(() => {
      const newPreviews = value.map((item, index) => {
        if (item instanceof File) {
          const existingPreview = previewUrls.find(p => p.id === index);
          if (existingPreview) {
            return existingPreview;
          }
          return { id: index, url: URL.createObjectURL(item) };
        }
        return { id: index, url: item };
      });

      setPreviewUrls(newPreviews);
    }, [value]);

    const handleRemove = (index: number) => {
      const newValue = [...value];
      newValue.splice(index, 1);
      onChange(newValue);
    };

    return (
      <div className="space-y-4">
        <div className="max-w-[500px] overflow-hidden rounded-lg border border-gray-200">
          <FileUpload
            value={undefined}
            onChange={(files) => {
              const newFiles = files.map(file => file);
              onChange([...value, ...newFiles]);
            }}
            maxSizeInMB={5}
            multiple={true}
          />
        </div>
        {value.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {value.map((file, index) => (
              <div key={index} className="relative aspect-square w-full overflow-hidden rounded-lg border border-gray-200">
                {previewUrls[index] ? (
                  <Image
                    src={previewUrls[index].url}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gray-50 p-4">
                    <p className="text-center text-sm text-gray-500">
                      {file instanceof File ? file.name : 'Loading preview...'}
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

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
                name="publishedAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Publish Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
              <h2 className="font-semibold text-gray-900">Images</h2>

              <FormField
                control={form.control}
                name="imageUrls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-purple-600" />
                        Upload Images
                      </div>
                    </FormLabel>
                    <FormControl>
                      <MultipleFileUploadField
                        value={field.value}
                        onChange={field.onChange}
                      />
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
