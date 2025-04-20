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
import { preserveHKTDate } from "@/lib/utils";

export default function CreateEventPage() {
  const router = useRouter();
  const createEvent = api.event.create.useMutation({
    onSuccess: () => {
      toast.success("Event created successfully");
      router.push("/events");
      router.refresh();
    },
    onError: (error) => {
      toast.error("Failed to create event", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (values: EventFormValues) => {
    try {
      let imageUrl = values.imageUrl;

      if (values.imageUrl instanceof File) {
        const uploadResult = await uploadFile(values.imageUrl, "event");
        imageUrl = uploadResult.url;
      }

      // Preserve the HKT date when converting to UTC for storage
      const adjustedDate = preserveHKTDate(values.date);

      createEvent.mutate({
        ...values,
        price: Number(values.price),
        capacity: values.capacity ? Number(values.capacity) : undefined,
        date: adjustedDate,
        imageUrl: imageUrl as string,
      });
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1200px] px-8 py-8">
        {/* Back Button */}
        <Link
          href="/admin/create"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Create
        </Link>

        <EventForm
          onSubmit={onSubmit}
          isSubmitting={createEvent.isPending}
          submitLabel="Create Event"
        />
      </div>
    </div>
  );
}
