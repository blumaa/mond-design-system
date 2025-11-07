import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@mond-design-system/theme/styles.css";
import "@mond-design-system/theme/button.css";
import "@mond-design-system/theme/badge.css";
import "@mond-design-system/theme/avatar.css";
import "@mond-design-system/theme/text.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MDS Next.js 16 Example",
  description: "Testing Mond Design System with Next.js 16 Server Components",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
