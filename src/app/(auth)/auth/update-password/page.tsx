"use client";

import { useRouter, useSearchParams } from "next/navigation";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect, Suspense } from "react";
import { updateUserPassword } from "../../actions";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const updatePasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

function UpdatePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Get the code from URL and exchange it for a session
  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      const supabase = createClient();
      supabase.auth.exchangeCodeForSession(code).catch((err) => {
        setError("Invalid or expired password reset link");
      });
    } else {
      setError("Missing password reset code");
    }
  }, [searchParams]);

  const onSubmit = async (data: UpdatePasswordInput) => {
    try {
      setIsUpdating(true);
      setError(null);
      
      const result = await updateUserPassword(data.password);
      
      if (result.error) {
        setError(result.error);
      } else {
        // Show success message with Sonner
        toast.success("Password Updated Successfully", {
          description: "You will be redirected to login...",
        });
        
        // Wait for 2 seconds before redirecting
        setTimeout(() => {
          router.push("/login?message=Password updated successfully");
        }, 1000);
      }
    } catch (err) {
      setError("An error occurred while updating your password");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full max-w-md px-8">
      <h1 className="mb-2 text-3xl font-bold text-[#383590]">
        Update Password
      </h1>
      <p className="mb-8 text-[#383590]/70">
        Please enter your new password below
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-1 flex-col justify-center gap-4 animate-in"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#383590]">New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your new password"
                    type="password"
                    {...field}
                    className="border-[#F5BC4C]/20 focus-visible:ring-[#F5BC4C]"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#383590]">Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm your new password"
                    type="password"
                    {...field}
                    className="border-[#F5BC4C]/20 focus-visible:ring-[#F5BC4C]"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="mt-2 bg-[#F5BC4C] text-white hover:bg-[#F5BC4C]/90"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Updating...</span>
              </div>
            ) : (
              "Update Password"
            )}
          </Button>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3">
              <p className="text-center text-sm font-medium text-red-800">
                {error}
              </p>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}

// Export a dynamic route
export const dynamic = 'force-dynamic';

export default function UpdatePasswordPage() {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ height: "calc(100vh - 5rem)" }}
    >
      <div className="hidden h-full grow bg-[#F5BC4C]/10 lg:block" />
      <div className="h-full w-full bg-background lg:w-1/2">
        <div className="flex h-full items-center justify-center">
          <Suspense fallback={
            <div className="flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#F5BC4C] border-t-transparent"></div>
            </div>
          }>
            <UpdatePasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}