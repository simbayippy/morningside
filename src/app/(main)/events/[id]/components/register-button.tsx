"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { RegisterDialog } from "./register-dialog";
import { api } from "@/trpc/react";
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

interface RegisterButtonProps {
  eventId: string;
  price: number;
  isAtCapacity: boolean;
  isLoggedIn: boolean;
  isRegistered: boolean;
}

export default function RegisterButton({
  eventId,
  price,
  isAtCapacity,
  isLoggedIn,
  isRegistered,
}: RegisterButtonProps) {
  const router = useRouter();
  const utils = api.useUtils();

  const { mutate: cancelRegistration, isPending: isCancelling } = api.event.cancelRegistration.useMutation({
    onSuccess: () => {
      toast.success("Successfully cancelled registration");
      void utils.event.getById.invalidate({ id: eventId });
      router.refresh();
    },
    onError: (error) => {
      toast.error("Failed to cancel registration", {
        description: error.message,
      });
    },
  });

  if (!isLoggedIn) {
    return (
      <Button
        onClick={() => router.push("/login")}
        className="w-full bg-[#F5BC4C] text-white hover:bg-[#F5BC4C]/90"
      >
        Login to Register
      </Button>
    );
  }

  if (isRegistered) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            className="w-full bg-red-500 text-white hover:bg-red-600"
            disabled={isCancelling}
          >
            {isCancelling ? "Cancelling..." : "Cancel Registration"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Registration?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your registration for this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => cancelRegistration({ eventId })}
              disabled={isCancelling}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {isCancelling ? "Cancelling..." : "Yes, Cancel Registration"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (isAtCapacity) {
    return (
      <Button
        disabled
        className="w-full bg-[#F5BC4C] text-white hover:bg-[#F5BC4C]/90"
      >
        Event Full
      </Button>
    );
  }

  return (
    <RegisterDialog
      eventId={eventId}
      price={price}
      trigger={
        <Button className="w-full bg-[#F5BC4C] text-white hover:bg-[#F5BC4C]/90">
          Register for Event
        </Button>
      }
    />
  );
}
