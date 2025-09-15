"use client";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, Box } from "@mond-design-system/theme";
import { cypherTheme } from "@mond-design-system/theme";
import { Navigation } from "../components/Navigation";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body style={{ fontFamily: jetbrainsMono.style.fontFamily }}>
        <ThemeProvider brandTheme={cypherTheme} colorScheme="dark">
          <Box
            minHeight="100vh"
            bg="surface.background"
            fontFamily="mono"
          >
            <Navigation />
            <Box pt="5xl">
              {children as JSX.Element}
            </Box>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}
