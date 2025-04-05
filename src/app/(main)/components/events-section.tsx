import Link from "next/link";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import { formatDate } from "@/lib/utils";

export async function EventsSection() {
  // Fetch both upcoming and past events
  const [upcomingEvents, pastEvents] = await Promise.all([
    api.event.getUpcoming(),
    api.event.getPast(),
  ]);

  // Only show the latest 4 upcoming events and 2 past events
  const latestUpcomingEvents = upcomingEvents.slice(0, 4);
  const latestPastEvents = pastEvents.slice(0, 2);

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="mb-12 text-4xl font-bold text-primary">
          Programs & Events
        </h2>

        {/* Upcoming Events Section */}
        <div className="mb-16">
          <h3 className="mb-8 text-2xl font-semibold text-gray-900">
            Upcoming Events
          </h3>

          {latestUpcomingEvents.length === 0 ? (
            <div className="rounded-lg bg-white p-8 text-center shadow-sm">
              <p className="text-gray-600">
                No upcoming events at the moment. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {latestUpcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex gap-6 rounded-md bg-white p-6 shadow-sm"
                >
                  {/* Date block */}
                  <div className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-md bg-muted">
                    <span className="text-sm font-semibold text-primary">
                      {formatDate(event.date, "MMM")}
                    </span>
                    <span className="text-xl font-bold text-primary">
                      {formatDate(event.date, "DD")}
                    </span>
                  </div>

                  {/* Event details */}
                  <div className="flex flex-col">
                    <p className="mb-1 text-xs text-gray-500">
                      {event.location}
                    </p>
                    <h3 className="mb-1 text-lg font-bold text-primary">
                      <Link
                        href={`/events/${event.id}`}
                        className="hover:underline"
                      >
                        {event.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-600">
                      {event.registrations.length}{" "}
                      {event.registrations.length === 1 ? "person" : "people"}{" "}
                      registered
                      {event.capacity &&
                        ` • ${event.capacity - event.registrations.length} spots left`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Events Section */}
        {latestPastEvents.length > 0 && (
          <div className="mb-16">
            <h3 className="mb-8 text-2xl font-semibold text-gray-900">
              Past Events
            </h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {latestPastEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex gap-6 rounded-md bg-white/50 p-6 shadow-sm"
                >
                  {/* Date block */}
                  <div className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-md bg-muted/50">
                    <span className="text-sm font-semibold text-primary/70">
                      {formatDate(event.date, "MMM")}
                    </span>
                    <span className="text-xl font-bold text-primary/70">
                      {formatDate(event.date, "DD")}
                    </span>
                  </div>

                  {/* Event details */}
                  <div className="flex flex-col">
                    <p className="mb-1 text-xs text-gray-400">
                      {event.location}
                    </p>
                    <h3 className="mb-1 text-lg font-bold text-primary/70">
                      <Link
                        href={`/events/${event.id}`}
                        className="hover:underline"
                      >
                        {event.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-500">
                      {event.registrations.length}{" "}
                      {event.registrations.length === 1 ? "person" : "people"}{" "}
                      attended
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <Link href="/events">
            <Button className="rounded-full bg-secondary px-10 py-6 font-semibold text-secondary-foreground hover:bg-secondary/90">
              View all Events <span className="ml-2">→</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
