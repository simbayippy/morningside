import "@/styles/globals.css";
import { cookies } from "next/headers";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/theme-provider";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Navbar from "@/components/navbar/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { type Metadata } from "next";
import { Red_Hat_Display, Literata } from "next/font/google";

const redHatDisplay = Red_Hat_Display({ subsets: ["latin"] });
const literata = Literata({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Morningside College Alumni Association",
  description: "Connect with fellow Morningside College alumni",
  icons: {
    icon: [
      {
        url: "/Logo.png",
        href: "/Logo.png",
      },
    ],
    apple: [
      {
        url: "/Logo.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={redHatDisplay.className}>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            <Navbar />
            {/* {children} */}
            {children}
            <Toaster />
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
