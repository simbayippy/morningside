"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PaymentSettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current payment settings
  const { data: paymentSettings, isLoading, refetch } = api.payment.getPaymentSettings.useQuery();

  // Form state
  const [formData, setFormData] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    bankCode: "",
    additionalInfo: "",
  });

  // Update form data when payment settings are loaded
  useState(() => {
    if (paymentSettings) {
      setFormData({
        bankName: paymentSettings.bankName ?? "",
        accountName: paymentSettings.accountName ?? "",
        accountNumber: paymentSettings.accountNumber ?? "",
        bankCode: paymentSettings.bankCode ?? "",
        additionalInfo: paymentSettings.additionalInfo ?? "",
      });
    }
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Update payment settings mutation
  const updatePaymentSettings = api.payment.updatePaymentSettings.useMutation({
    onSuccess: () => {
      toast.success("Payment settings updated", {
        description: "The payment settings have been updated successfully.",
      });
      void refetch(); // Using void operator to explicitly mark the Promise as ignored
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message || "Failed to update payment settings",
      });
      setIsSubmitting(false);
    },
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    updatePaymentSettings.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[800px] px-8 py-16">
        <div className="mb-8 flex items-center gap-2">
          <Link href="/admin/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
        
        <div className="mb-8">
          <h1 className="font-mono text-4xl font-bold text-gray-900">
            Payment Settings
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Manage bank account details for membership and event payments.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bank Transfer Details</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      placeholder="e.g. HSBC"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input
                      id="accountName"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleChange}
                      placeholder="e.g. Morningside College Alumni Association"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      placeholder="e.g. 123-456789-000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bankCode">Bank Code</Label>
                    <Input
                      id="bankCode"
                      name="bankCode"
                      value={formData.bankCode}
                      onChange={handleChange}
                      placeholder="e.g. 004"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Instructions (Optional)</Label>
                  <Textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    placeholder="Any additional payment instructions or notes"
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Payment Settings"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
