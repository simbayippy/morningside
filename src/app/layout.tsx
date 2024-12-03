import "@/styles/globals.css";
import { cookies } from "next/headers";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/theme-provider";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Navbar from "@/components/navbar/Navbar";

export const metadata = {
  title: "Katalog | AI file organizer",
  description:
    "Katalog automatically organizes your file downloads into appropriate folders, so you never lose track of your files again.",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/apple-touch-icon.png" },
  ],
  // Add this line:
  verification: {
    google: "google00aa727eef66840c.html",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistMono.className} suppressHydrationWarning>
      {/* <html lang="en" className={GeistSans.className} suppressHydrationWarning> */}
      <body>
        <TRPCReactProvider >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            <Navbar />
            {/* {children} */}
            {children}
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
