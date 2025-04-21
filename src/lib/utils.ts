import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date, format?: string): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Hong_Kong'
  };

  if (format === "MMM") {
    return new Intl.DateTimeFormat("en-US", {
      ...options,
      month: "short",
    }).format(date);
  }

  if (format === "DD") {
    return new Intl.DateTimeFormat("en-US", {
      ...options,
      day: "2-digit",
    }).format(date);
  }

  if (format === "TIME") {
    return new Intl.DateTimeFormat("en-US", {
      ...options,
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  }

  return new Intl.DateTimeFormat("en-US", {
    ...options,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
}

export function formatDateNoTime(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Hong_Kong',
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "HKD",
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

// Helper function to ensure a date selected in HKT is properly stored as UTC
// This preserves the intended HKT time when stored in the database
export function preserveHKTDate(date: Date | string): Date {
  // Create a date object from the input
  const inputDate = typeof date === 'string' ? new Date(date) : new Date(date.getTime());
  
  // Extract the components of the date as shown in the browser
  const year = inputDate.getFullYear();
  const month = inputDate.getMonth();
  const day = inputDate.getDate();
  const hours = inputDate.getHours();
  const minutes = inputDate.getMinutes();
  const seconds = inputDate.getSeconds();
  
  // Create a new date as if these numbers represent HKT
  // Since HKT is UTC+8, we create the date with UTC and subtract 8 hours
  const hktDate = new Date(Date.UTC(year, month, day, hours - 8, minutes, seconds));
  
  return hktDate;
}

// Helper function to convert UTC date to HKT
export function convertUTCtoHKT(date: Date | string): Date {
  const utcDate = typeof date === 'string' ? new Date(date) : new Date(date.getTime());
  
  // HKT is UTC+8, so we add 8 hours
  const hktDate = new Date(utcDate.getTime() + (8 * 60 * 60 * 1000));
  
  return hktDate;
}