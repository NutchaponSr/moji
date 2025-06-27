import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "./globals.css";

import { TRPCReactProvider } from "@/trpc/client";
import { EdgeStoreProvider } from "@/lib/edgestore";

import { ThemeProvider } from "@/providers/theme-provider";

import { Toaster } from "@/components/ui/sonner";

const font = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moji",
  description: "Individual development plan SaaS",
  icons: {
    icon: "/logo.svg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${font.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="moji-theme"
        >
          <TRPCReactProvider>
            <NuqsAdapter>
              <EdgeStoreProvider>
                {children}
                <Toaster richColors position="top-center" />
              </EdgeStoreProvider>
            </NuqsAdapter>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
