import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import { formatDate } from "@/lib/utils";

export async function NewsSection() {
  const news = await api.news.getAll();

  // Only show the latest 2 news items
  const latestNews = news.slice(0, 2);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="mb-12 text-4xl font-bold text-primary">Alumni News</h2>

        <div className="space-y-16">
          {latestNews.map((item) => (
            <div key={item.id} className="flex flex-col gap-8 md:flex-row">
              {/* Left side - Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-muted md:w-2/5">
                <Image
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
                  src={item.imageUrls[0] ?? "/placeholder.jpg"}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Right side - Content */}
              <div className="flex flex-col md:w-3/5">
                <div className="mb-4 flex items-center">
                  <div className="mr-4 h-1 w-16 bg-primary"></div>
                  <p className="text-gray-600">
                    {formatDate(item.publishedAt)}
                  </p>
                </div>

                <Link href={`/news/${item.slug}`}>
                  <h3 className="mb-4 text-2xl font-bold text-primary hover:text-primary/80 md:text-3xl">
                    {item.title}
                  </h3>
                </Link>

                <p className="mb-6 text-gray-600">{item.excerpt}</p>

                <Link href={`/news/${item.slug}`} className="mt-auto">
                  <Button
                    variant="link"
                    className="p-0 font-semibold text-primary hover:text-primary/80"
                  >
                    Read more →
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link href="/news">
            <Button className="rounded-full bg-secondary px-10 py-6 font-semibold text-secondary-foreground hover:bg-secondary/90">
              View all News <span className="ml-2">→</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
