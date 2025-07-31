import { ThemeProvider } from './context/ThemeContext';
import './globals.css';

export const metadata = {
  title: 'Mond Design System',
  description: 'A component library for building modern web applications',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
