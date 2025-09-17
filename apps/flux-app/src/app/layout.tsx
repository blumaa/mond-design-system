'use client';

import { ReactNode } from "react";
import { ThemeProvider, Box } from "@mond-design-system/theme";
import { fluxTheme } from "@mond-design-system/theme";
import { Navigation } from "../components/Navigation";
import "./globals.css";
import "../styles/responsive.css";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider brandTheme={fluxTheme} colorScheme="dark">
          <Box minHeight="100vh" bg="surface.background">
            <Navigation />
            <Box pt="24">
              {children as any}
            </Box>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}