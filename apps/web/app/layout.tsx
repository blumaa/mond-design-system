"use client";
import { ReactNode } from 'react';
import { ThemeWrapper } from './components/ThemeWrapper';
import './globals.css';

function ThemedBody({ children }: { children: ReactNode }) {
  return (
    <ThemeWrapper>
      <div style={{ minHeight: '100vh' }}>
        {children}
      </div>
    </ThemeWrapper>
  );
}

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <ThemedBody>
          {children}
        </ThemedBody>
      </body>
    </html>
  );
}
