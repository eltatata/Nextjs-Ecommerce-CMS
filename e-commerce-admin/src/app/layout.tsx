import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ClerkProvider } from '@clerk/nextjs';
import { ModalProvider } from "@/providers/modal-provider";
import { ThemeProvider } from '@/providers/theme-provider'

import { Toaster } from "@/components/ui/sonner"

import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin panel for an E-Commerce store built with Nextjs and TailwindCSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <ModalProvider />
            <Toaster
              richColors
            />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider >
  );
}
