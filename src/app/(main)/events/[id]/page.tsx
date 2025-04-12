import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { formatDate, formatPrice } from "@/lib/utils";
import RegisterButton from "./components/register-button";
import { AdminControls } from "./components/admin-controls";
import { RegisteredUsers } from "./components/registered-users";
import { getCurrentUser, isUserAdmin } from "@/lib/auth";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export default async function EventPage({ params }: EventPageProps) {
  // Await the params object before destructuring
  const { id } = await params;

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
            className="group inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-[#383590] shadow-md backdrop-blur-sm transition-colors hover:bg-white hover:text-[#383590]/90"
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
          <div className="h-full w-full bg-gradient-to-r from-[#F5BC4C]/90 to-[#F5BC4C]/60" />
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
                    <div className="text-sm font-semibold uppercase text-[#383590]">
                      {formatDate(event.date, "MMM")}
                    </div>
                    <div className="mt-1 text-3xl font-bold text-[#383590]">
                      {formatDate(event.date, "DD")}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-[#383590]">
                      {event.title}
                    </h1>
                    <p className="mt-2 text-[#383590]/70">
                      {formatDate(event.date, "TIME")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Event Info Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-[#F5BC4C]" />
                    <div>
                      <p className="text-sm font-medium text-[#383590]/70">
                        Location
                      </p>
                      <p className="text-base font-semibold text-[#383590]">
                        {event.location}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-[#F5BC4C]" />
                    <div>
                      <p className="text-sm font-medium text-[#383590]/70">Price</p>
                      <p className="text-base font-semibold text-[#383590]">
                        {formatPrice(Number(event.price))}
                      </p>
                    </div>
                  </div>
                </div>
                {event.capacity && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-[#F5BC4C]" />
                      <div>
                        <p className="text-sm font-medium text-[#383590]/70">
                          Capacity
                        </p>
                        <p className="text-base font-semibold text-[#383590]">
                          {registeredCount} / {event.capacity}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#383590]">
                  About this Event
                </h2>
                <div className="prose max-w-none prose-headings:text-[#383590] prose-a:text-[#383590] hover:prose-a:text-[#383590]/80">
                  <p className="text-[#383590]/70">{event.description}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Registration */}
            <div className="lg:w-80">
              <div className="sticky top-8 space-y-6 rounded-lg border border-gray-200 p-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-[#383590]">
                    Event Registration
                  </h3>
                  <p className="text-sm text-[#383590]/70">
                    {isAtCapacity
                      ? "This event has reached its capacity."
                      : currentUser
                        ? "Secure your spot at this event by registering now."
                        : "Please login to register for this event."}
                  </p>
                </div>

                <RegisterButton
                  eventId={event.id}
                  price={Number(event.price)}
                  isAtCapacity={isAtCapacity}
                  isLoggedIn={!!currentUser}
                  isRegistered={event.registrations.some(
                    (registration) => registration.userId === currentUser?.id
                  )}
                />

                {isAdmin && <AdminControls eventId={event.id} />}
              </div>

              {/* Registered Users */}
              <RegisteredUsers registrations={event.registrations} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
