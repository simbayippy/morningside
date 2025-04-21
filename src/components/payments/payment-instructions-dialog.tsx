"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Info, Loader2 } from "lucide-react";
import { api } from "@/trpc/react";

interface PaymentInstructionsDialogProps {
  trigger?: React.ReactNode;
}

export function PaymentInstructionsDialog({
  trigger,
}: PaymentInstructionsDialogProps) {
  // Fetch payment settings
  const { data: paymentSettings, isLoading } = api.payment.getPaymentSettings.useQuery();
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
            <Info className="mr-1 h-3 w-3" />
            Payment Instructions
          </Badge>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Payment Instructions</DialogTitle>
          <DialogDescription>
            Please follow the bank transfer instructions below.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-medium">Bank Transfer Details</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Bank:</strong> {paymentSettings?.bankName ?? "[Bank details not configured]"}</p>
                <p><strong>Account Name:</strong> {paymentSettings?.accountName ?? "Morningside College Alumni Association"}</p>
                <p><strong>Account Number:</strong> {paymentSettings?.accountNumber ?? "[Account details not configured]"}</p>
                <p><strong>Bank Code:</strong> {paymentSettings?.bankCode ?? "[Bank code not configured]"}</p>
                {paymentSettings?.additionalInfo && (
                  <div className="mt-4 rounded-md bg-amber-50 p-3 text-amber-800">
                    <p className="font-medium">Additional Instructions:</p>
                    <p>{paymentSettings.additionalInfo}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h4 className="mb-2 font-medium text-amber-800">Important</h4>
              <ul className="ml-4 list-disc space-y-2 text-sm text-amber-800">
                <li>Make sure to take a screenshot of your successful payment</li>
                <li>You will need to upload this as proof of payment</li>
              </ul>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}