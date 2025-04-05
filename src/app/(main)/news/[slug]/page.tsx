import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/trpc/server";
import { formatDate } from "@/lib/utils";
import { isUserAdmin } from "@/lib/auth";
import { AdminControls } from "./admin-controls";

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
            {article.author.name && (
              <>
                <span>•</span>
                <div className="flex items-center gap-2">
                  {article.author.image && (
                    <Image
                      src={article.author.image}
                      alt={article.author.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  )}
                  <span>{article.author.name}</span>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative mb-12 aspect-[2/1] overflow-hidden rounded-lg">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none prose-headings:text-[#383590] prose-a:text-[#383590] hover:prose-a:text-[#383590]/80">
          {article.content}
        </div>

        {/* Admin Controls & Navigation */}
        <div className="mt-16 space-y-8">
          {isAdmin && <AdminControls slug={article.slug} />}
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
