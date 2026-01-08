import type React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import ClientWrapper from "./ClientWrapper";

export const metadata: Metadata = {
  title: "Promise Electronics - TV Repair Shop",
  description: "POS Billing, Inventory Management & Job Tickets",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ClientWrapper>{children}</ClientWrapper>
        <Toaster position="top-right" />
        <Analytics />
      </body>
    </html>
  );
}
