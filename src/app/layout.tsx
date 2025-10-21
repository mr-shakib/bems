import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { cn } from "@/lib/utils";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "BEMS - Business Enterprise Management System",
  description: "Manage your business, projects, and teams in one place. BEMS helps you simplify workspace management, streamline collaboration, and track progress effortlessly.",
  icons: {
    icon: [
      {
        url: "/assets/images/utl_logo_bems.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/assets/images/utl_logo_bems.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    shortcut: "/assets/images/utl_logo_bems.png",
    apple: "/assets/images/utl_logo_bems.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(inter.className, "antialiased min-h-screen")}
      >
        <NuqsAdapter>
          <QueryProvider>
            <Toaster />
            {children}
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
