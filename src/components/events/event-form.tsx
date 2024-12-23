"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FileUpload } from "@/components/ui/file-upload";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import type { Event } from "@prisma/client";
import { Calendar, Image as ImageIcon, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  price: z.string().min(1, "Price is required"),
  capacity: z.string().optional(),
  imageUrl: z
    .union([z.string(), z.instanceof(File)])
    .refine((val) => val !== "", {
      message: "Event image is required",
    }),
});

export type EventFormValues = z.infer<typeof formSchema>;

interface EventFormProps {
  initialData?: Event | null;
  onSubmit: (values: EventFormValues) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel: string;
}

export function EventForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitLabel,
}: EventFormProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          date: initialData.date
            ? new Date(initialData.date).toISOString()
            : "",
          location: initialData.location,
          price: String(initialData.price),
          capacity: initialData.capacity ? String(initialData.capacity) : "",
          imageUrl: initialData.imageUrl ?? "",
        }
      : {
          title: "",
          description: "",
          date: "",
          location: "",
          price: "",
          capacity: "",
          imageUrl: "",
        },
  });

  const isEdit = !!initialData;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="rounded-xl bg-white shadow-md">
          {/* Header */}
          <div className="border-b border-gray-200 px-8 py-6">
            <h1 className="font-mono text-2xl font-bold text-gray-900">
              {isEdit ? "Edit Event" : "Create New Event"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isEdit
                ? "Update the details of your event"
                : "Fill in the details to create a new event"}
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-8 px-8 py-6">
            {/* Basic Info Section */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a descriptive title for your event"
                        className="h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a detailed description of your event"
                        className="min-h-[150px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Event Details Section */}
            <div className="space-y-6">
              <h2 className="font-semibold text-gray-900">Event Details</h2>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-purple-600" />
                          Date and Time
                        </div>
                      </FormLabel>
                      <FormControl>
                        <DateTimePicker
                          value={
                            field.value ? new Date(field.value) : undefined
                          }
                          onChange={(date) =>
                            field.onChange(date?.toISOString())
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-purple-600" />
                          Location
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Event venue or address"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center gap-2">
                          <span className="text-purple-600">$</span>
                          Price
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-purple-600" />
                          Capacity (optional)
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Maximum number of attendees"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-6">
              <h2 className="font-semibold text-gray-900">Event Image</h2>

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-purple-600" />
                        Upload Image
                      </div>
                    </FormLabel>
                    <FormControl>
                      <div className="max-w-[500px] overflow-hidden rounded-lg border border-gray-200">
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="border-t border-gray-200 px-8 py-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(isSubmitting && "cursor-not-allowed opacity-50")}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>
                    {submitLabel === "Create Event"
                      ? "Creating..."
                      : "Updating..."}
                  </span>
                </div>
              ) : (
                submitLabel
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
