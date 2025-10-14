import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBottomNav from "@/components/ClientBottomNav";
import CapacitorInit from "@/components/CapacitorInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Steam Iron Partner",
  description: "Delivery Partner mobile web app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
        suppressHydrationWarning={true}
      >
        <div className="mx-auto w-full max-w-sm min-h-screen flex flex-col bg-white safe-area" suppressHydrationWarning>
          <CapacitorInit />
          <main className="flex-1">{children}</main>
          <ClientBottomNav />
        </div>
      </body>
    </html>
  );
}
