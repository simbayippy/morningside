import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/trpc/server";
import { formatDate } from "@/lib/utils";
import { isUserAdmin } from "@/lib/auth";
import { AdminControls } from "./admin-controls";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface NewsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: NewsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await api.news.getBySlug({ slug });

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: `${article.title} | Morningside Alumni News`,
    description: article.excerpt,
  };
}

export default async function NewsArticlePage({ params }: NewsPageProps) {
  const { slug } = await params;

  // Fetch article data and check admin status in parallel
  const [article, isAdmin] = await Promise.all([
    api.news.getBySlug({ slug }),
    isUserAdmin(),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <article className="mx-auto max-w-3xl px-8 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex text-sm text-[#383590]/70">
            <li>
              <Link href="/news" className="hover:text-[#383590]">
                News
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li className="text-[#383590]">{article.title}</li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-[#383590]">{article.title}</h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-[#383590]/70">
            <time dateTime={article.publishedAt.toISOString()}>
              {formatDate(article.publishedAt)}
            </time>
          </div>
        </header>

        {/* Image Carousel */}
        <div className="mb-12">
          <Carousel className="relative w-full">
            <CarouselContent>
              {/* eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */}
              {article.imageUrls.map((imageUrl, index) => (
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                <CarouselItem key={index}>
                  <div className="relative aspect-[2/1] overflow-hidden rounded-lg">
                    <Image
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      src={imageUrl}
                      alt={`${article.title} - Image ${index + 1}`}
                      fill
                      priority={index === 0}
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-4 md:-left-12" />
            <CarouselNext className="absolute -right-4 md:-right-12" />
          </Carousel>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none prose-headings:text-[#383590] prose-a:text-[#383590] hover:prose-a:text-[#383590]/80 [&>p]:mb-8">
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */}
          {article.content.split('\n').map((paragraph: string, index: number) => (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            paragraph.trim() && (
              <p key={index}>{paragraph}</p>
            )
          ))}
        </div>

        {/* Admin Controls & Navigation */}
        <div className="mt-16 space-y-8">
          {isAdmin && <AdminControls slug={article.slug} id={article.id} />}
          <div className="flex justify-center">
            <Link
              href="/news"
              className="rounded-full bg-[#383590] px-6 py-3 text-sm font-semibold text-white hover:bg-[#383590]/90"
            >
              ← Back to News
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
