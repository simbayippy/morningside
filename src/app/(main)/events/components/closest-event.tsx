import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { type Event } from "@prisma/client";
import { MapPin, Calendar, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ClosestEventProps {
  event: Event;
}

export function ClosestEvent({ event }: ClosestEventProps) {
  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:border-[#F5BC4C]/30 hover:shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <Link
          href={`/events/${event.id}`}
          className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 lg:aspect-[3/3]"
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
        <div className="flex flex-col justify-between p-8">
          <div className="space-y-6">
            <div>
              <Link
                href={`/events/${event.id}`}
                className="inline-block transition duration-200 hover:opacity-70"
              >
                <h3 className="text-3xl font-bold text-[#F5BC4C] group-hover:text-[#F5BC4C]/90">
                  {event.title}
                </h3>
              </Link>
              <div className="mt-4 flex items-center gap-2 text-lg text-[#383590]">
                <MapPin className="h-5 w-5 text-[#F5BC4C]" />
                {event.location}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-lg text-[#383590]">
                <Calendar className="h-5 w-5 text-[#F5BC4C]" />
                {formatDate(event.date)}
              </div>
              <div className="flex items-center gap-2 text-lg text-[#383590]">
                <Clock className="h-5 w-5 text-[#F5BC4C]" />
                {formatDate(event.date, "TIME")}
                {" - end"}
              </div>
            </div>

            {event.price && (
              <div className="inline-flex rounded-full bg-[#F5BC4C]/10 px-4 py-1 text-lg font-medium text-[#F5BC4C]">
                {event.price?.toString()} HKD
              </div>
            )}

            {event.description && (
              <p className="text-gray-600">{event.description}</p>
            )}
          </div>

          <Button
            className="mt-8 w-fit bg-[#F5BC4C] text-white hover:bg-[#F5BC4C]/90"
            size="lg"
            asChild
          >
            <Link href={`/events/${event.id}`}>Sign Up Now!</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
