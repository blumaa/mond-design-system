"use client";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@mond-design-system/theme";
import { cypherTheme } from "@mond-design-system/theme";
import { Navigation } from "../components/Navigation";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${jetbrainsMono.variable} antialiased bg-black font-mono`}>
        <ThemeProvider brandTheme={cypherTheme} colorScheme="dark">
          <Navigation />
          <div style={{ paddingTop: '80px' }}>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
