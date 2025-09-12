'use client';

import React, { useEffect, useRef } from 'react';

interface MatrixRainProps {
  opacity?: number;
  speed?: number;
  fontSize?: number;
  columns?: number;
  characters?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function MatrixRain({
  opacity = 0.1,
  speed = 50,
  fontSize = 14,
  columns = 80,
  characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?',
  className,
  style,
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix rain variables
    const matrix = characters;
    const drops: number[] = [];
    const columnWidth = fontSize * 0.6;
    const actualColumns = Math.floor(canvas.width / columnWidth);

    // Initialize drops
    for (let x = 0; x < actualColumns; x++) {
      drops[x] = 1;
    }

    // Animation function
    function draw() {
      if (!ctx || !canvas) return;

      // Black background with slight transparency for trailing effect
      ctx.fillStyle = `rgba(10, 10, 11, 0.05)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Matrix green text
      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;

      // Loop through drops
      for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        const x = i * columnWidth;
        const y = drops[i] * fontSize;

        // Add slight opacity variation for depth effect
        const alpha = Math.random() * 0.5 + 0.5;
        ctx.fillStyle = `rgba(0, 255, 65, ${alpha * opacity * 10})`;
        ctx.fillText(text, x, y);

        // Reset drop if it reaches bottom or random chance
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Move drop down
        drops[i]++;
      }

      animationIdRef.current = requestAnimationFrame(draw);
    }

    // Start animation with speed control
    const interval = setInterval(() => {
      draw();
    }, speed);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [opacity, speed, fontSize, columns, characters]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        ...style,
      }}
    />
  );
}

// Simpler CSS-only matrix rain effect as fallback
export function CSSMatrixRain({ 
  opacity = 0.1,
  className,
  style 
}: Pick<MatrixRainProps, 'opacity' | 'className' | 'style'>) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
  
  // Generate random character columns
  const generateColumns = (count: number) => {
    const columns = [];
    for (let i = 0; i < count; i++) {
      const columnChars = [];
      const charCount = Math.floor(Math.random() * 20) + 5;
      
      for (let j = 0; j < charCount; j++) {
        columnChars.push(characters[Math.floor(Math.random() * characters.length)]);
      }
      
      columns.push({
        chars: columnChars,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
        left: `${Math.random() * 100}%`,
      });
    }
    return columns;
  };

  const columns = generateColumns(50);

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        opacity,
        ...style,
      }}
    >
      {columns.map((column, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: column.left,
            top: '-100px',
            color: '#00ff41',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1',
            whiteSpace: 'nowrap',
            animation: `matrixFall ${column.duration}s linear ${column.delay}s infinite`,
          }}
        >
          {column.chars.map((char, charIndex) => (
            <div
              key={charIndex}
              style={{
                opacity: Math.random() * 0.8 + 0.2,
                animation: `matrixFlicker ${Math.random() * 2 + 1}s ease-in-out infinite`,
              }}
            >
              {char}
            </div>
          ))}
        </div>
      ))}
      
      <style jsx>{`
        @keyframes matrixFall {
          to {
            transform: translateY(calc(100vh + 100px));
          }
        }
        
        @keyframes matrixFlicker {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}