import { ThemeProvider } from './context/ThemeContext';
import './globals.css';

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
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
