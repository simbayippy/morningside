"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { RegisterDialog } from "./register-dialog";

interface RegisterButtonProps {
  eventId: string;
  price: number;
  isAtCapacity: boolean;
  isLoggedIn: boolean;
}

export default function RegisterButton({
  eventId,
  price,
  isAtCapacity,
  isLoggedIn,
}: RegisterButtonProps) {
  const router = useRouter();

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
