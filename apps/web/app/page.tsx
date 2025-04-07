"use client";

import React from 'react';
import { Button } from '@comp-lib-proto/ui';

export default function Home() {
  return (
    <main style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      gap: '1rem'
    }}>
      <h1>Component Library Demo</h1>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <Button variant="primary">Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="outline">Outline Button</Button>
        <Button variant="ghost">Ghost Button</Button>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button size="sm">Small Button</Button>
        <Button size="md">Medium Button</Button>
        <Button size="lg">Large Button</Button>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <Button disabled>Disabled Button</Button>
      </div>
    </main>
  );
}
