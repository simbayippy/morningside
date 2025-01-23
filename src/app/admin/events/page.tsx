"use client";

import { api } from "@/trpc/react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Loader2, User } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function EventsPage() {
  const { data: upcomingEvents, isLoading: isLoadingUpcoming } =
    api.event.getUpcoming.useQuery();
  const { data: pastEvents, isLoading: isLoadingPast } =
    api.event.getPast.useQuery();

  const isLoading = isLoadingUpcoming || isLoadingPast;

  const events = [...(upcomingEvents ?? []), ...(pastEvents ?? [])].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1200px] px-8 py-8">
        {/* Back Button */}
        <Link
          href="/admin/dashboard"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="font-mono text-3xl font-bold text-gray-900">
            Event Registrations
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            View and manage event registrations.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading events...
          </div>
        ) : (
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Registrations</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {event.imageUrl && (
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="h-8 w-8 rounded-lg object-cover"
                          />
                        )}
                        {event.title}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(event.date)}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>${Number(event.price).toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>
                          {event.registrations?.length ?? 0}
                          {event.capacity ? ` / ${event.capacity}` : ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/admin/events/${event.id}`}
                        className="text-sm font-medium text-purple-600 hover:text-purple-700"
                      >
                        View Details
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </div>
  );
}
