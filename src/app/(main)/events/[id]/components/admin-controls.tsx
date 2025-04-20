// src/app/(main)/events/[id]/admin-controls.tsx
"use client";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <div className="text-xl font-semibold">Deleting Event...</div>
        <div className="text-muted-foreground">This may take a few moments</div>
      </div>
    </div>
  );
}

export function AdminControls({ eventId }: { eventId: string }) {
  const router = useRouter();
  const deleteEvent = api.event.delete.useMutation({
    onSuccess: () => {
      toast.success("Event deleted successfully");
      router.push("/events");
      router.refresh();
    },
    onError: (error) => {
      toast.error("Failed to delete event", {
        description: error.message,
      });
    },
  });

  return (
    <>
      {deleteEvent.isPending && <LoadingOverlay />}
      <div className="mt-6 flex gap-4">
        <Link href={`/admin/edit/events/${eventId}`}>
          <Button variant="outline" className="gap-2">
            <Pencil className="h-4 w-4" />
            Edit Event
          </Button>
        </Link>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="gap-2"
              disabled={deleteEvent.isPending}
            >
              <Trash className="h-4 w-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                event and remove all registrations associated with it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteEvent.isPending}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteEvent.mutate({ id: eventId })}
                disabled={deleteEvent.isPending}
                className="gap-2 bg-destructive hover:bg-destructive/90"
              >
                {deleteEvent.isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash className="h-4 w-4" />
                    Delete Event
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
