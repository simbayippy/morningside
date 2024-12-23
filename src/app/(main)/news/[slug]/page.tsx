import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/trpc/server";
import { formatDate } from "@/lib/utils";

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
  const article = await api.news.getBySlug({ slug });

  if (!article) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-8 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex text-sm text-gray-500">
          <li>
            <Link href="/news" className="hover:text-primary">
              News
            </Link>
          </li>
          <li className="mx-2">/</li>
          <li className="text-gray-900">{article.title}</li>
        </ol>
      </nav>

      {/* Article Header */}
      <header className="mb-8">
        <h1 className="font-mono text-4xl font-bold">{article.title}</h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
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
      <div className="prose prose-lg max-w-none">{article.content}</div>

      {/* Navigation */}
      <div className="mt-16 flex justify-center">
        <Link
          href="/news"
          className="rounded-full bg-gray-100 px-6 py-3 text-sm font-semibold hover:bg-gray-200"
        >
          ← Back to News
        </Link>
      </div>
    </article>
  );
}
