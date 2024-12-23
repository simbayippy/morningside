import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date, format?: string): string {
  if (format === "MMM") {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(date);
  }

  if (format === "DD") {
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
    }).format(date);
  }

  if (format === "TIME") {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function isAdmin(user: { isAdmin: boolean } | null): boolean {
  return !!user?.isAdmin;
}

export function isVerified(user: { isVerified: boolean } | null): boolean {
  return !!user?.isVerified;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
