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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from "lucide-react";

interface PaymentInstructionsDialogProps {
  trigger?: React.ReactNode;
}

export function PaymentInstructionsDialog({
  trigger,
}: PaymentInstructionsDialogProps) {
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
            Please choose your preferred payment method and follow the instructions below.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="payme" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="payme">PayMe</TabsTrigger>
            <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
          </TabsList>
          <TabsContent value="payme" className="space-y-4">
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-medium">PayMe Instructions</h4>
              <ol className="ml-4 list-decimal space-y-2 text-sm text-muted-foreground">
                <li>Open your PayMe app</li>
                <li>Scan the QR code or search for our PayMe ID: [Your PayMe ID]</li>
                <li>Enter the exact amount for your membership type</li>
                <li>Include your full name in the payment note</li>
                <li>Take a screenshot of the successful payment</li>
              </ol>
            </div>
          </TabsContent>
          <TabsContent value="bank" className="space-y-4">
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-medium">Bank Transfer Details</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Bank:</strong> [Bank Name]</p>
                <p><strong>Account Name:</strong> Morningside College Alumni Association</p>
                <p><strong>Account Number:</strong> [Account Number]</p>
                <p><strong>Bank Code:</strong> [Bank Code]</p>
                <p className="mt-4">Please include your full name as the payment reference.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}