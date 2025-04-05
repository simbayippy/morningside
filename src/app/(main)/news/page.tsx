import { api } from "@/trpc/server";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Newspaper } from "lucide-react";

export default async function NewsPage() {
  const [news, currentUser] = await Promise.all([
    api.news.getAll(),
    getCurrentUser(),
  ]);

  // Get the featured article and other articles
  const featuredArticle = news[0];
  const otherArticles = news.slice(1);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1200px] px-8 py-16">
        <div className="mb-12 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-[#383590]">Alumni News</h1>
          {currentUser?.isAdmin && (
            <Link href="/admin/create/news">
              <Button className="bg-[#383590] text-white hover:bg-[#383590]/90">
                <Newspaper className="mr-2 h-4 w-4" />
                Create Article
              </Button>
            </Link>
          )}
        </div>

        {/* News Content */}
        <div className="space-y-16">
          {/* Featured Article Section */}
          <div>
            <h2 className="mb-8 text-2xl font-bold text-[#383590]">
              Featured Article
            </h2>
            {featuredArticle ? (
              <Link href={`/news/${featuredArticle.slug}`} className="group block">
                <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg">
                  <Image
                    src={featuredArticle.imageUrl}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 p-6 text-white">
                    <p className="mb-2 text-sm">
                      {formatDate(featuredArticle.publishedAt)}
                    </p>
                    <h2 className="mb-2 text-3xl font-bold group-hover:underline">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-gray-200">{featuredArticle.excerpt}</p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="rounded-lg border border-dashed border-[#383590]/30 bg-[#383590]/5 px-6 py-16">
                <div className="text-center">
                  <Newspaper className="mx-auto h-12 w-12 text-[#383590]/30" />
                  <h3 className="mt-4 text-lg font-medium text-[#383590]">
                    No Featured Article
                  </h3>
                  <p className="mt-2 text-[#383590]/70">
                    Check back soon for new articles or subscribe to our
                    newsletter to stay updated.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Latest Articles Section */}
          {otherArticles.length > 0 && (
            <div>
              <h2 className="mb-8 text-2xl font-bold text-[#383590]">
                Latest Articles
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {otherArticles.map((article) => (
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
                        <p className="text-sm text-[#383590]/70">
                          {formatDate(article.publishedAt)}
                        </p>
                        <h3 className="mt-2 text-xl font-bold text-[#383590] group-hover:underline">
                          {article.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-[#383590]/70">
                          {article.excerpt}
                        </p>
                        {article.author.name && (
                          <p className="mt-4 flex items-center gap-2 text-sm text-[#383590]/70">
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
          )}
        </div>
      </div>
    </div>
  );
}
