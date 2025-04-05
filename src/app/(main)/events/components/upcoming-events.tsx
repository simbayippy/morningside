import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { type Event } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { MapPin, Calendar } from "lucide-react";

interface UpcomingEventsProps {
  events: Event[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <div
          key={event.id}
          className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:border-[#F5BC4C]/30 hover:shadow-lg"
        >
          <Link
            href={`/events/${event.id}`}
            className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100"
          >
            {event.imageUrl ? (
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No image available
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
          </Link>
          <div className="flex flex-1 flex-col p-6">
            <Link
              href={`/events/${event.id}`}
              className="group/title inline-block transition duration-200 hover:opacity-70"
            >
              <h3 className="mb-2 text-xl font-bold text-[#F5BC4C] group-hover:text-[#F5BC4C]/90">
                {event.title}
              </h3>
            </Link>
            <div className="mb-2 flex items-center gap-2 text-[#383590]">
              <MapPin className="h-4 w-4 text-[#F5BC4C]" />
              {event.location}
            </div>
            <div className="mb-2 flex items-center gap-2 text-[#383590]">
              <Calendar className="h-4 w-4 text-[#F5BC4C]" />
              <div>
                <div>
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div>
                  {new Date(event.date).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}{" "}
                  - end
                </div>
              </div>
            </div>
            <div className="mb-4 w-fit rounded-full bg-[#F5BC4C]/10 px-3 py-1 text-sm font-medium text-[#F5BC4C]">
              {event.price instanceof Decimal
                ? event.price.toString()
                : event.price}{" "}
              HKD
            </div>
            <Button
              className="mt-auto w-fit bg-[#F5BC4C] text-white hover:bg-[#F5BC4C]/90"
              asChild
            >
              <Link href={`/events/${event.id}`}>Sign Up</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
