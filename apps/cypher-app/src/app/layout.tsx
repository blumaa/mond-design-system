import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@mond-design-system/theme";
import { cypherTheme } from "@mond-design-system/theme";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CYPHER - Developer Tools",
  description: "Cyberpunk developer interface for system monitoring and control",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${jetbrainsMono.variable} antialiased bg-black font-mono`}>
        <ThemeProvider brandTheme={cypherTheme} colorScheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
