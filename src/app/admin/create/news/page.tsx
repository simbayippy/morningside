"use client";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { NewsForm, type NewsFormValues } from "@/components/news/news-form";
import { uploadFile } from "@/lib/upload";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateNewsPage() {
  const router = useRouter();
  const createNews = api.news.create.useMutation({
    onSuccess: () => {
      toast.success("News article created successfully");
      router.push("/news");
      router.refresh();
    },
    onError: (error) => {
      toast.error("Failed to create news article", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (values: NewsFormValues) => {
    try {
      const imageUrls = values.imageUrls;
      const finalImageUrls: string[] = [];

      if (Array.isArray(imageUrls)) {
        // Upload new files
        const filesToUpload = imageUrls.filter((img): img is File => img instanceof File);
        const uploadPromises = filesToUpload.map(file => uploadFile(file, "news"));
        const uploadResults = await Promise.all(uploadPromises);
        const uploadedUrls = uploadResults.map(result => result?.url ?? "").filter(Boolean);

        // Build final array of URLs, replacing File objects with their uploaded URLs
        let uploadedIndex = 0;
        imageUrls.forEach(img => {
          if (img instanceof File) {
            const uploadedUrl = uploadedUrls[uploadedIndex++];
            if (uploadedUrl) {
              finalImageUrls.push(uploadedUrl);
            }
          } else if (typeof img === "string") {
            finalImageUrls.push(img);
          }
        });
      }

      createNews.mutate({
        ...values,
        imageUrls: finalImageUrls,
        excerpt: values.summary,
        publishedAt: values.publishedAt,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload images");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1200px] px-8 py-8">
        {/* Back Button */}
        <Link
          href="/admin/create"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Create
        </Link>

        <NewsForm
          onSubmit={onSubmit}
          isSubmitting={createNews.isPending}
          submitLabel="Create News Article"
        />
      </div>
    </div>
  );
}
