import { api } from "@/trpc/server";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Event } from "@prisma/client";
import { SearchForm } from "./components/search-form";
import { NoEvents } from "./components/no-events";
import { EventList } from "./components/event-list";

interface EventsPageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { search = "" } = await searchParams;

  const [upcomingEvents, pastEvents, currentUser] = await Promise.all([
    api.event.getUpcoming(),
    api.event.getPast(),
    getCurrentUser(),
  ]);

  const filterEvents = (events: Event[], searchTerm = "") => {
    if (!searchTerm) return events;
    const searchLower = searchTerm.toLowerCase();
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower),
    );
  };

  const filteredUpcoming = filterEvents(upcomingEvents, search);
  const filteredPast = filterEvents(pastEvents, search);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1200px] px-8 py-16">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="font-mono text-4xl font-bold text-gray-900">
              Alumni Events
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-600">
              Join us for exciting events and programs designed to keep our
              alumni community connected and engaged.
            </p>
          </div>
          {currentUser?.isAdmin && (
            <Link href="/create/events">
              <Button className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-700">
                Create Event
              </Button>
            </Link>
          )}
        </div>

        <SearchForm defaultValue={search} />

        <Tabs defaultValue="upcoming" className="w-full">
          <div className="mb-8">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="upcoming">
            {filteredUpcoming.length === 0 ? (
              <NoEvents
                message={
                  search
                    ? "No matching events found"
                    : "No upcoming events found"
                }
              />
            ) : (
              <EventList events={filteredUpcoming} />
            )}
          </TabsContent>

          <TabsContent value="past">
            {filteredPast.length === 0 ? (
              <NoEvents
                message={
                  search ? "No matching events found" : "No past events found"
                }
              />
            ) : (
              <EventList events={filteredPast} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
