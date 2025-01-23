"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const formSchema = z.object({
  englishName: z.string().optional().nullable(),
  chineseName: z.string().optional().nullable(),
  preferredName: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface NonMemberEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: FormValues & { image?: string | null };
  onSubmit: (values: FormValues) => Promise<void>;
  isPending: boolean;
}

export function NonMemberEditDialog({
  open,
  onOpenChange,
  profile,
  onSubmit,
  isPending,
}: NonMemberEditDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: profile,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your name information here. You can add more details after
            becoming a member.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center py-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.image ?? undefined} />
                <AvatarFallback>
                  {profile.englishName?.[0] ??
                    profile.preferredName?.[0] ??
                    "?"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="englishName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>English Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your English name"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chineseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chinese Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your Chinese name"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your preferred name"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
