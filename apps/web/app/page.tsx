"use client";
import { Button } from '@mond-design-system/component-lib';
import { useTheme } from './context/ThemeContext';
import { ThemeSwitch } from './components/ThemeSwitch';

export default function Home() {
  const { isDarkMode, mounted } = useTheme();

  // Debug logging
  console.log('Home page isDarkMode:', isDarkMode, 'mounted:', mounted);

  const backgroundColor = isDarkMode ? '#27374D' : '#F2F3F4';
  const textColor = isDarkMode ? '#DDE6ED' : '#414A4C';

  // Show loading state until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <>
        <div style={{ 
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          width: '40px',
          height: '40px',
        }} />
        <main style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          gap: '1rem',
          backgroundColor: '#F2F3F4',
          color: '#414A4C',
          fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
        }}>
          <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 'bold' }}>
            Component Library Demo
          </h1>
        </main>
      </>
    );
  }

  return (
    <>
      <ThemeSwitch />
      <main style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        gap: '1rem',
        backgroundColor,
        color: textColor,
        fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}>
        <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 'bold' }}>
          Component Library Demo
        </h1>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <Button variant="primary" isDarkMode={isDarkMode}>Primary Button</Button>
          <Button variant="outline" isDarkMode={isDarkMode}>Outline Button</Button>
          <Button variant="ghost" isDarkMode={isDarkMode}>Ghost Button</Button>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <Button size="sm" isDarkMode={isDarkMode}>Small Button</Button>
          <Button size="md" isDarkMode={isDarkMode}>Medium Button</Button>
          <Button size="lg" isDarkMode={isDarkMode}>Large Button</Button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <Button variant="primary" corners="rounded" isDarkMode={isDarkMode}>Rounded</Button>
          <Button variant="outline" corners="default" isDarkMode={isDarkMode}>Default Corners</Button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <Button variant="primary" iconOnly isDarkMode={isDarkMode}>✓</Button>
          <Button variant="ghost" iconOnly corners="rounded" isDarkMode={isDarkMode}>♥</Button>
          <Button variant="outline" iconOnly isDarkMode={isDarkMode}>⚙</Button>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <Button disabled isDarkMode={isDarkMode}>Disabled Button</Button>
        </div>
      </main>
    </>
  );
}
