import React from 'react';

export const metadata = {
  title: 'Component Library Demo',
  description: 'A demo of our component library',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
