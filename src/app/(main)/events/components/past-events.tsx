import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { type Event } from "@prisma/client";
import { ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PastEventsProps {
  events: Event[];
}

export function PastEvents({ events }: PastEventsProps) {
  return (
    <section>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#383590]">
          Past Events Photos Gallery
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className="group relative block"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
              {event.imageUrl ? (
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-contain transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
              <div className="absolute right-4 top-4 rounded-full bg-white/90 p-2 shadow-sm transition duration-300 group-hover:bg-[#F5BC4C]">
                <ArrowUpRight className="h-4 w-4 text-[#383590] transition duration-300 group-hover:text-white" />
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="font-bold text-[#383590] transition duration-200 group-hover:text-[#F5BC4C]">
                {event.title}
              </h3>
              <p className="text-sm text-[#383590]/70">
                {formatDate(event.date)}
              </p>
              <p className="text-sm text-[#383590]/70">{event.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
