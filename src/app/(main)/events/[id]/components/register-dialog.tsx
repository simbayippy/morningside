"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PaymentInstructionsDialog } from "@/components/payments/payment-instructions-dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { uploadFile } from "@/lib/upload";
import Image from "next/image";

interface RegisterDialogProps {
  eventId: string;
  price: number;
  trigger?: React.ReactNode;
}

export function RegisterDialog({ eventId, price, trigger }: RegisterDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [paymentImage, setPaymentImage] = useState<File | string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const register = api.event.register.useMutation({
    onSuccess: () => {
      toast.success("Successfully registered for event!");
      setIsOpen(false);
      router.refresh();
    },
    onError: (error) => {
      console.error("Failed to register for event:", error);
      toast.error("Failed to register for event", {
        description: error.message,
      });
    },
    onSettled: () => {
      setIsRegistering(false);
    },
  });

  const handleRegister = async () => {
    if (!paymentImage) {
      toast.error("Please upload your payment proof");
      return;
    }

    try {
      setIsRegistering(true);
      
      let paymentImageUrl: string;

      if (paymentImage instanceof File) {
        console.log("Starting file upload process...");
        console.log("File details:", {
          name: paymentImage.name,
          size: paymentImage.size,
          type: paymentImage.type
        });
        
        const uploadResult = await uploadFile(paymentImage, "event");
        paymentImageUrl = uploadResult.url;
        console.log("File upload successful:", paymentImageUrl);
      } else if (typeof paymentImage === "string") {
        paymentImageUrl = paymentImage;
      } else {
        throw new Error("Invalid payment image type");
      }

      // Ensure we have valid data before making the mutation
      if (!eventId || !paymentImageUrl) {
        throw new Error("Missing required data for registration");
      }

      register.mutate({
        eventId,
        paymentImage: paymentImageUrl,
      });   
    } catch (error) {
      console.error("Error during registration:", error);
      if (error instanceof Error) {
        toast.error("Failed to complete registration", {
          description: error.message,
        });
      } else {
        toast.error("Failed to complete registration");
      }
      setIsRegistering(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Event Registration</DialogTitle>
          <DialogDescription>
            Please upload your payment proof to complete registration.
            The registration fee is HKD {price}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-[#383590]">Payment Proof</h4>
            <PaymentInstructionsDialog />
          </div>

          <div className="space-y-2">
            {paymentImage ? (
              <div className="rounded-lg border border-[#F5BC4C]/20 bg-[#F5BC4C]/5 p-4">
                {paymentImage instanceof File ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-[#F5BC4C]/20">
                        <Image
                          src={URL.createObjectURL(paymentImage)}
                          alt="Payment proof preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-[#383590] truncate">
                          {paymentImage.name}
                        </p>
                        <p className="text-sm text-[#383590]/70">
                          {(paymentImage.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPaymentImage(null)}
                      className="flex-shrink-0 text-[#383590] hover:text-[#383590]/90"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-[#F5BC4C]/20">
                        <Image
                          src={paymentImage}
                          alt="Payment proof"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-[#383590]">Uploaded payment proof</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPaymentImage(null)}
                      className="text-[#383590] hover:text-[#383590]/90"
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <FileUpload
                onChange={(files) => setPaymentImage(files[0] ?? null)}
                maxSizeInMB={5}
              />
            )}
          </div>

          <Button
            onClick={handleRegister}
            disabled={!paymentImage || isRegistering}
            className="w-full bg-[#F5BC4C] text-white hover:bg-[#F5BC4C]/90"
          >
            {isRegistering ? "Registering..." : "Complete Registration"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}