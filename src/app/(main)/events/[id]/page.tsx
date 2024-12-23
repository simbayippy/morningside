import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { formatDate, formatPrice } from "@/lib/utils";
import RegisterButton from "./register-button";
import { AdminControls } from "./admin-controls";
import { getCurrentUser, isUserAdmin } from "@/lib/auth";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface EventPageProps {
  params: {
    id: string;
  };
}

export default async function EventPage({ params }: EventPageProps) {
  // Await the params object before destructuring
  const awaitedParams = await Promise.resolve(params);
  const { id } = awaitedParams;

  // Fetch event data, check admin status, and get current user in parallel
  const [event, isAdmin, currentUser] = await Promise.all([
    api.event.getById({ id }).catch((error) => {
      console.error("Failed to fetch event:", error);
      return null;
    }),
    isUserAdmin(),
    getCurrentUser(),
  ]);

  if (!event) {
    notFound();
  }

  const registeredCount = event.registrations.length;
  const isAtCapacity = event.capacity
    ? registeredCount >= event.capacity
    : false;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Image */}
      <div className="relative h-[40vh] min-h-[400px] w-full bg-gray-900">
        {/* Back Button */}
        <div className="absolute left-0 right-0 top-8 z-10 mx-auto max-w-[1200px] px-8">
          <Link
            href="/events"
            className="group inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-gray-600 shadow-md backdrop-blur-sm transition-colors hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Events
          </Link>
        </div>

        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover opacity-60"
            sizes="100vw"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-purple-900 to-purple-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="relative mx-auto max-w-[1200px] px-8">
        {/* Main Content */}
        <div className="relative -mt-32 rounded-xl bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
            {/* Left Column - Event Details */}
            <div className="flex-1 space-y-8">
              {/* Title and Date */}
              <div>
                <div className="mb-6 flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-sm font-semibold uppercase text-purple-600">
                      {formatDate(event.date, "MMM")}
                    </div>
                    <div className="mt-1 text-3xl font-bold text-gray-900">
                      {formatDate(event.date, "DD")}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h1 className="font-mono text-3xl font-bold text-gray-900">
                      {event.title}
                    </h1>
                    <p className="mt-2 text-gray-600">
                      {formatDate(event.date, "TIME")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Event Info Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Location
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {event.location}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Price</p>
                      <p className="text-base font-semibold text-gray-900">
                        {formatPrice(Number(event.price))}
                      </p>
                    </div>
                  </div>
                </div>
                {event.capacity && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Capacity
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          {registeredCount} / {event.capacity}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="font-mono text-2xl font-bold text-gray-900">
                  About this Event
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-600">{event.description}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Registration */}
            <div className="lg:w-80">
              <div className="sticky top-8 space-y-6 rounded-lg border border-gray-200 p-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Event Registration
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isAtCapacity
                      ? "This event has reached its capacity."
                      : currentUser
                        ? "Secure your spot at this event by registering now."
                        : "Please login to register for this event."}
                  </p>
                </div>

                <RegisterButton
                  eventId={event.id}
                  isAtCapacity={isAtCapacity}
                  isLoggedIn={!!currentUser}
                />

                {isAdmin && <AdminControls eventId={event.id} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
