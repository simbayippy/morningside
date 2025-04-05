"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface RegisterButtonProps {
  eventId: string;
  isAtCapacity: boolean;
  isLoggedIn: boolean;
}

export default function RegisterButton({
  eventId,
  isAtCapacity,
  isLoggedIn,
}: RegisterButtonProps) {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);

  const register = api.event.register.useMutation({
    onSuccess: () => {
      toast.success("Successfully registered for event!");
      router.refresh();
    },
    onError: (error) => {
      console.error("Failed to register for event:", error);
      toast.error("Failed to register for event. Please try again.");
    },
    onSettled: () => {
      setIsRegistering(false);
    },
  });

  const handleRegister = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setIsRegistering(true);
    register.mutate({ eventId });
  };

  return (
    <Button
      onClick={handleRegister}
      disabled={isAtCapacity || isRegistering}
      className="w-full bg-[#F5BC4C] text-white hover:bg-[#F5BC4C]/90"
    >
      {isRegistering
        ? "Registering..."
        : isLoggedIn
          ? isAtCapacity
            ? "Event Full"
            : "Register for Event"
          : "Login to Register"}
    </Button>
  );
}
