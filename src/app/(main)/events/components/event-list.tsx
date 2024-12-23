import { type Event } from "@prisma/client";
import { EventCard } from "./event-card";

export function EventList({ events }: { events: Event[] }) {
  return (
    <div className="divide-y divide-gray-200">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
