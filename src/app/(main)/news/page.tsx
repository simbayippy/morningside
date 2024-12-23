import { api } from "@/trpc/server";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";

export default async function NewsPage() {
  const [news, currentUser] = await Promise.all([
    api.news.getAll(),
    getCurrentUser(),
  ]);

  return (
    <div className="mx-auto max-w-[1200px] px-8 py-16">
      {/* Header */}
      <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-mono text-4xl font-bold">Alumni News</h1>
          <p className="mt-4 text-lg text-gray-600">
            Stay connected with the latest updates, achievements, and stories
            from our vibrant alumni community.
          </p>
        </div>
        {currentUser?.isAdmin && (
          <Link
            href="/news/create"
            className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 sm:mt-0"
          >
            Create Article
          </Link>
        )}
      </div>

      {/* Featured Article */}
      {news[0] && (
        <div className="mb-16">
          <Link href={`/news/${news[0].slug}`} className="group block">
            <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg">
              <Image
                src={news[0].imageUrl}
                alt={news[0].title}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 p-6 text-white">
                <p className="mb-2 text-sm">
                  {formatDate(news[0].publishedAt)}
                </p>
                <h2 className="mb-2 text-3xl font-bold group-hover:underline">
                  {news[0].title}
                </h2>
                <p className="text-gray-200">{news[0].excerpt}</p>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* News Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {news.slice(1).map((article) => (
          <Link
            href={`/news/${article.slug}`}
            key={article.id}
            className="group block"
          >
            <article className="h-full">
              <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  {formatDate(article.publishedAt)}
                </p>
                <h3 className="mt-2 font-mono text-xl font-bold group-hover:underline">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                  {article.excerpt}
                </p>
                {article.author.name && (
                  <p className="mt-4 flex items-center gap-2 text-sm text-gray-500">
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
                  </p>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
