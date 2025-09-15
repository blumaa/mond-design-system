import { ReactNode } from "react";
import { JetBrains_Mono } from "next/font/google";
import { ThemeProvider, Box } from "@mond-design-system/theme";
import { cypherTheme } from "@mond-design-system/theme";
import { Navigation } from "../components/Navigation";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'CYPHER.SYS - Neural Network Interface',
  description: 'Secure quantum-encrypted neural network command center',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body style={{ fontFamily: jetbrainsMono.style.fontFamily }}>
        <ThemeProvider brandTheme={cypherTheme} colorScheme="dark">
          <Box minHeight="100vh" bg="surface.background">
            <Navigation />
            <Box pt="5xl">
              {children as any}
            </Box>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}