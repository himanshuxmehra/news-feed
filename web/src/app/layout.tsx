import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "News Feed",
  description: "A web app built with Next.js",
};
import { Toaster } from "@/components/ui/toaster";
import { Protected } from "@/components/auth/Protected";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        {children}
        {/* {children} */}
        <Toaster />
      </body>
    </html>
  );
}
