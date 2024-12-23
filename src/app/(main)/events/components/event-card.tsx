import { type Event } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/events/${event.id}`}>
      <div className="group flex items-start gap-8 border-b border-gray-200 py-8 transition-colors hover:bg-gray-50">
        {/* Date Column */}
        <div className="w-24 text-center">
          <div className="text-sm font-semibold uppercase text-purple-600">
            {formatDate(event.date, "MMM")}
          </div>
          <div className="mt-1 text-3xl font-bold text-gray-900">
            {formatDate(event.date, "DD")}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {formatDate(event.date, "TIME")}
          </div>
        </div>

        {/* Details Column */}
        <div className="flex-1">
          <div className="mb-2 text-sm font-medium uppercase tracking-wide text-purple-600">
            {event.location}
          </div>
          <h3 className="font-mono text-xl font-bold text-gray-900 group-hover:underline">
            {event.title}
          </h3>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <span>${event.price.toFixed(2)}</span>
            {event.capacity && (
              <>
                <span>•</span>
                <span>Capacity: {event.capacity}</span>
              </>
            )}
          </div>
          <p className="mt-3 line-clamp-2 text-base leading-relaxed text-gray-600">
            {event.description}
          </p>
        </div>

        {/* Image Column */}
        {event.imageUrl && (
          <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
      </div>
    </Link>
  );
}
