import { api } from "@/trpc/server";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClosestEvent } from "./components/closest-event";
import { UpcomingEvents } from "./components/upcoming-events";
import { PastEvents } from "./components/past-events";
import { CalendarPlus } from "lucide-react";

export default async function EventsPage() {
  const [upcomingEvents, pastEvents, currentUser] = await Promise.all([
    api.event.getUpcoming(),
    api.event.getPast(),
    getCurrentUser(),
  ]);

  // Get the closest (most immediate) upcoming event
  const closestEvent = upcomingEvents[0];
  // Get the rest of the upcoming events
  const otherUpcomingEvents = upcomingEvents.slice(1);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1200px] px-8 py-16">
        <div className="mb-12 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-[#383590]">All Events</h1>
          {currentUser?.isAdmin && (
            <Link href="/admin/create/events">
              <Button className="bg-[#383590] text-white hover:bg-[#383590]/90">
                <CalendarPlus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </Link>
          )}
        </div>

        {/* Events Content */}
        <div className="space-y-16">
          {/* Upcoming Events Section */}
          <div>
            <h2 className="mb-8 text-2xl font-bold text-[#383590]">
              Upcoming Events
            </h2>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-16">
                {/* Closest Event Section */}
                {closestEvent && <ClosestEvent event={closestEvent} />}
                {/* Other Upcoming Events */}
                {otherUpcomingEvents.length > 0 && (
                  <UpcomingEvents events={otherUpcomingEvents} />
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-[#383590]/30 bg-[#383590]/5 px-6 py-16">
                <div className="text-center">
                  <CalendarPlus className="mx-auto h-12 w-12 text-[#383590]/30" />
                  <h3 className="mt-4 text-lg font-medium text-[#383590]">
                    No Upcoming Events
                  </h3>
                  <p className="mt-2 text-[#383590]/70">
                    Check back soon for new events or subscribe to our
                    newsletter to stay updated.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Past Events Section */}
          {pastEvents.length > 0 && <PastEvents events={pastEvents} />}
        </div>
      </div>
    </div>
  );
}
