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
import { ArrowLeft, Download, Loader2, User, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { use, useState } from "react";
import { utils, writeFile } from "xlsx";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface EventDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EventDetailsPage({ params }: EventDetailsPageProps) {
  // Unwrap the params Promise
  const { id } = use(params);

  const { data: event, isLoading } = api.event.getById.useQuery({
    id,
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const handleExport = () => {
    if (!event) return;

    // Prepare data for export
    const data = event.registrations.map((registration) => ({
      Name: registration.user.name ?? "Unnamed User",
      Email: registration.user.email,
      Status: registration.status,
      "Registered On": formatDate(registration.createdAt),
    }));

    // Create workbook and worksheet
    const wb = utils.book_new();
    const ws = utils.json_to_sheet(data);

    // Add worksheet to workbook
    utils.book_append_sheet(wb, ws, "Registrations");

    // Generate and download file
    writeFile(wb, `${event.title} - Registrations.xlsx`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading event details...
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-600">Event not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1200px] px-8 py-8">
        {/* Back Button */}
        <Link
          href="/admin/events"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Events
        </Link>

        <div className="mb-8">
          <h1 className="font-mono text-3xl font-bold text-gray-900">
            {event.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-4 text-gray-600">
            <div>
              <span className="font-medium">Date:</span>{" "}
              {formatDate(event.date)}
            </div>
            <div>
              <span className="font-medium">Location:</span> {event.location}
            </div>
            <div>
              <span className="font-medium">Price:</span> $
              {Number(event.price).toFixed(2)}
            </div>
            {event.capacity && (
              <div>
                <span className="font-medium">Capacity:</span>{" "}
                {event.registrations.length} / {event.capacity}
              </div>
            )}
          </div>
          <p className="mt-4 text-gray-600">{event.description}</p>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-mono text-xl font-bold text-gray-900">
            Registrations
          </h2>
          <Button
            onClick={handleExport}
            variant="outline"
            className="gap-2"
            disabled={event.registrations.length === 0}
          >
            <Download className="h-4 w-4" />
            Export to Excel
          </Button>
        </div>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Proof</TableHead>
                <TableHead>Registered On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {event.registrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    No registrations yet
                  </TableCell>
                </TableRow>
              ) : (
                event.registrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {registration.user.image ? (
                          <img
                            src={registration.user.image}
                            alt={registration.user.name ?? "User"}
                            className="h-6 w-6 rounded-full"
                          />
                        ) : (
                          <User className="h-6 w-6 text-gray-400" />
                        )}
                        {registration.user.name ?? "Unnamed User"}
                      </div>
                    </TableCell>
                    <TableCell>{registration.user.email}</TableCell>
                    <TableCell>
                      <div className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        {registration.status}
                      </div>
                    </TableCell>
                    <TableCell>
                      {registration.paymentImage ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 text-blue-600 hover:text-blue-700"
                          onClick={() => {
                            setSelectedImage(registration.paymentImage as string);
                            setIsImageDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          View Receipt
                        </Button>
                      ) : (
                        <span className="text-gray-500">No receipt</span>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(registration.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Image Preview Dialog */}
        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogTitle>Payment Receipt</DialogTitle>
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg">
              {selectedImage && (
                <Image
                  src={selectedImage}
                  alt="Payment receipt"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
