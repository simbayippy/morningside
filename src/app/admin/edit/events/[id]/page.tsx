"use client";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  EventForm,
  type EventFormValues,
} from "@/components/events/event-form";
import { uploadFile } from "@/lib/upload";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { preserveHKTDate } from "@/lib/utils";

interface EditEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditEventPage({ params }: EditEventPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: event, isLoading } = api.event.getById.useQuery({ id });

  const updateEvent = api.event.update.useMutation({
    onSuccess: () => {
      toast.success("Event updated successfully");
      router.push(`/events/${id}`);
      router.refresh();
    },
    onError: (error) => {
      toast.error("Failed to update event", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (values: EventFormValues) => {
    try {
      let imageUrl = values.imageUrl;

      if (values.imageUrl instanceof File) {
        const uploadResult = await uploadFile(values.imageUrl);
        imageUrl = uploadResult.url;
      }

      // Preserve the HKT date when converting to UTC for storage
      const adjustedDate = preserveHKTDate(values.date);

      updateEvent.mutate({
        id,
        data: {
          ...values,
          price: Number(values.price),
          capacity: values.capacity ? Number(values.capacity) : undefined,
          date: adjustedDate,
          imageUrl: imageUrl as string,
        },
      });
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-[1200px] px-8 py-8">
          {/* Back Button */}
          <Link
            href={`/events/${id}`}
            className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Event
          </Link>

          <div className="mt-4 rounded-xl bg-white p-8 shadow-md">
            <div className="flex animate-pulse flex-col gap-8">
              <div className="h-8 w-48 rounded-md bg-gray-200" />
              <div className="space-y-6">
                <div className="h-12 rounded-md bg-gray-200" />
                <div className="h-32 rounded-md bg-gray-200" />
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="h-12 rounded-md bg-gray-200" />
                <div className="h-12 rounded-md bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log("data of event", event);

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-lg bg-white p-8 text-center shadow-md">
          <h2 className="text-xl font-semibold text-gray-900">
            Event not found
          </h2>
          <p className="mt-2 text-gray-600">
            The event you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link
            href="/events"
            className="mt-6 inline-flex items-center gap-2 text-purple-600 hover:text-purple-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1200px] px-8 py-8">
        {/* Back Button */}
        <Link
          href={`/events/${id}`}
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Event
        </Link>

        <EventForm
          initialData={event}
          onSubmit={onSubmit}
          isSubmitting={updateEvent.isPending}
          submitLabel="Update Event"
        />
      </div>
    </div>
  );
}
