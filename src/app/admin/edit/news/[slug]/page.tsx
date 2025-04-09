"use client";

import { useEffect } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { NewsForm } from "@/components/news/news-form";
import type { NewsFormValues } from "@/components/news/news-form";
import { uploadFile } from "@/lib/upload";

export default function EditNewsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const { slug } = use(params);

  const { data: article, isLoading } = api.news.getBySlug.useQuery({
    slug,
  });

  useEffect(() => {
    if (!isLoading && !article) {
      toast.error("Article not found");
      router.push("/news");
    }
  }, [article, isLoading, router]);

  const updateArticle = api.news.update.useMutation({
    onSuccess: () => {
      toast.success("Article updated successfully");
      router.push(`/news/${article?.slug}`);
      router.refresh();
    },
    onError: (error) => {
      toast.error("Failed to update article", {
        description: error.message,
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <div className="text-xl font-semibold">Loading Article...</div>
          <div className="text-muted-foreground">This may take a few moments</div>
        </div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  const handleSubmit = async (values: NewsFormValues) => {
    try {
      const imageUrls = values.imageUrls;
      const finalImageUrls: string[] = [];

      if (Array.isArray(imageUrls)) {
        // Upload new files
        const filesToUpload = imageUrls.filter((img): img is File => img instanceof File);
        const uploadPromises = filesToUpload.map(file => uploadFile(file, "news"));
        const uploadResults = await Promise.all(uploadPromises);
        const uploadedUrls = uploadResults.map((result: { url: string } | undefined) => result?.url ?? "").filter(Boolean);

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

      updateArticle.mutate({
        id: article.id,
        data: {
          title: values.title,
          slug: values.slug,
          content: values.content,
          excerpt: values.summary,
          imageUrls: finalImageUrls,
          publishedAt: values.publishedAt,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload images");
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <NewsForm
        initialData={{
          title: article.title,
          slug: article.slug,
          content: article.content,
          summary: article.excerpt,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          imageUrls: article.imageUrls,
          publishedAt: article.publishedAt,
        }}
        onSubmit={handleSubmit}
        isSubmitting={updateArticle.isPending}
        submitLabel="Update Article"
      />
    </div>
  );
}
