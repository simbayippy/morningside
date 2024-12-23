"use client";

import Link from "next/link";
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
import React, { useState } from "react";
import { signup } from "../actions";
import OauthButton from "@/components/auth/OauthButton";
import { CheckCircle2 } from "lucide-react";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export type SignupInput = z.infer<typeof registerSchema>;

export default function Login() {
  const form = useForm<SignupInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string>("");

  const onSubmit = async (data: SignupInput) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    const result = await signup(formData);
    if (result?.error) {
      setError(result.error as string | null);
    } else {
      setVerificationEmail(data.email);
      setIsVerificationSent(true);
    }
  };

  if (isVerificationSent) {
    return (
      <div className="flex">
        <div className="hidden h-screen grow bg-secondary/15 lg:block" />
        <div className="h-screen w-full bg-background lg:w-1/2">
          <div className="flex h-full items-center justify-center">
            <div className="w-full max-w-md p-8">
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground" />
                <h1 className="text-2xl font-semibold">
                  Check your email to confirm
                </h1>
                <p className="text-center text-muted-foreground">
                  You&apos;ve successfully signed up. Please check your email (
                  {verificationEmail}) to confirm your account before signing in
                  to the Supabase dashboard. The confirmation link expires in 10
                  minutes.
                </p>
                <div className="flex items-center gap-2 py-4">
                  <hr className="w-full" />
                  <p className="text-xs text-muted-foreground">or</p>
                  <hr className="w-full" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Have an account?{" "}
                  <Link href="/login" className="underline">
                    Sign In Now
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="hidden h-screen grow bg-secondary/15 lg:block" />
      <div className="h-screen w-full bg-background lg:w-1/2">
        <div className="flex h-full items-center justify-center">
          <div className="w-full max-w-md p-8">
            <h1 className="mb-4 text-2xl font-semibold">Sign up</h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full flex-1 flex-col justify-center gap-2 text-muted-foreground animate-in"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your email address"
                          {...field}
                          autoComplete="on"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your password"
                          type="password"
                          autoComplete="on"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button variant="default" className="my-3 w-full" type="submit">
                  Sign up
                </Button>
                {error && (
                  <div className="mb-3 mt-1 rounded-md border border-destructive bg-destructive/10 p-3">
                    <p className="text-center text-sm font-medium text-destructive">
                      {error}
                    </p>
                  </div>
                )}
              </form>
            </Form>
            <div className="flex items-center gap-2 py-4">
              <hr className="w-full" />
              <p className="text-xs text-muted-foreground">OR</p>
              <hr className="w-full" />
            </div>
            <OauthButton provider={"google"} />
            <p className="py-4 text-center text-sm text-muted-foreground underline">
              <Link href="/login">Already have an account? Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
