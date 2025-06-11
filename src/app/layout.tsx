import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";

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
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="moji-theme"
        >
          <TRPCReactProvider>
            <EdgeStoreProvider>
              {children}
              <Toaster richColors position="top-center" />
            </EdgeStoreProvider>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
