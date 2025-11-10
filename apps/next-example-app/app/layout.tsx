import type { Metadata } from "next";
import "./globals.css";
import { AppThemeProvider } from "./providers/theme-provider";

export const metadata: Metadata = {
  title: "MDS Next.js POC",
  description: "Proof of Concept for Mond Design System with CSS Variables API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}
