import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ModalProvider from "@/providers/modal-provider";
import { Toaster } from "@/components/ui/sonner"

const font = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Store",
  description: "Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ModalProvider />
        <Toaster
          position="top-center"
          richColors
        />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
