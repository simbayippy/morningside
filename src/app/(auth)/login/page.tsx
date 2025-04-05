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
import { login, AuthResponse } from "../actions";
import OauthButton from "@/components/auth/OauthButton";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export type LoginInput = z.infer<typeof registerSchema>;

export default function Login() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: LoginInput) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    const result: AuthResponse = await login(formData);
    if (result.error) {
      setError(result.error);
    }
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ height: "calc(100vh - 5rem)" }}
    >
      <div className="hidden h-full grow bg-[#F5BC4C]/10 lg:block" />
      <div className="h-full w-full bg-background lg:w-1/2">
        <div className="flex h-full items-center justify-center">
          <div className="w-full max-w-md px-8">
            <h1 className="mb-2 text-3xl font-bold text-[#383590]">
              Welcome Back
            </h1>
            <p className="mb-8 text-[#383590]/70">
              Sign in to your account to continue
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full flex-1 flex-col justify-center gap-4 animate-in"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#383590]">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          {...field}
                          autoComplete="on"
                          className="border-[#F5BC4C]/20 focus-visible:ring-[#F5BC4C]"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#383590]">Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your password"
                          type="password"
                          autoComplete="on"
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
                >
                  Sign in
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

            <div className="my-8 flex items-center gap-2">
              <hr className="flex-1 border-[#F5BC4C]/10" />
              <p className="text-xs text-[#383590]/50">OR</p>
              <hr className="flex-1 border-[#F5BC4C]/10" />
            </div>

            <OauthButton provider={"google"} />

            <p className="mt-8 text-center text-sm text-[#383590]/70">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-[#F5BC4C] hover:text-[#F5BC4C]/90"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
