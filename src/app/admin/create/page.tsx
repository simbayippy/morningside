import { Calendar, Newspaper } from "lucide-react";
import Link from "next/link";

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1200px] px-8 py-16">
        <div className="mb-12">
          <h1 className="font-mono text-4xl font-bold text-gray-900">
            Create Content
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Choose what type of content you would like to create.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Event Creation Card */}
          <Link
            href="/create/events"
            className="group relative overflow-hidden rounded-xl bg-white p-8 shadow-md transition-all hover:shadow-lg"
          >
            <div className="relative z-10">
              <Calendar className="mb-6 h-12 w-12 text-purple-600" />
              <h2 className="mb-2 font-mono text-2xl font-bold text-gray-900">
                Create Event
              </h2>
              <p className="text-gray-600">
                Create a new event for alumni to attend and engage with the
                community.
              </p>
            </div>
            <div className="absolute inset-0 -z-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>

          {/* News Creation Card */}
          <Link
            href="/create/news"
            className="group relative overflow-hidden rounded-xl bg-white p-8 shadow-md transition-all hover:shadow-lg"
          >
            <div className="relative z-10">
              <Newspaper className="mb-6 h-12 w-12 text-purple-600" />
              <h2 className="mb-2 font-mono text-2xl font-bold text-gray-900">
                Create News
              </h2>
              <p className="text-gray-600">
                Share important news and updates with the alumni community.
              </p>
            </div>
            <div className="absolute inset-0 -z-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        </div>
      </div>
    </div>
  );
}
