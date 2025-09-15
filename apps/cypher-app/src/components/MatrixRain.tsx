'use client';

import React, { useEffect, useRef } from 'react';
import { Box } from '@mond-design-system/theme';

interface MatrixRainProps {
  opacity?: number;
  speed?: number;
  fontSize?: number;
  columns?: number;
  characters?: string;
}

export function MatrixRain({
  opacity = 0.1,
  speed = 50,
  fontSize = 14,
  columns = 80,
  characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?',
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastFrameTime = 0;
    let animationId = 0;

    // Matrix rain variables
    const matrix = characters;
    const drops: number[] = [];
    const columnWidth = fontSize * 0.6;
    let actualColumns = Math.floor(canvas.width / columnWidth);

    // Initialize drops function
    const initializeDrops = () => {
      actualColumns = Math.floor(canvas.width / columnWidth);
      drops.length = 0; // Clear existing drops
      for (let x = 0; x < actualColumns; x++) {
        drops[x] = Math.floor(Math.random() * canvas.height / fontSize);
      }
    };

    // Set canvas size to match container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;

      // Reinitialize drops after resize
      initializeDrops();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Optimized animation function with fps throttling
    function draw(currentTime: number) {
      if (!ctx || !canvas) return;

      // Throttle to target FPS based on speed (higher speed = lower FPS)
      const targetFPS = Math.max(15, 60 - speed);
      const frameDelay = 1000 / targetFPS;

      if (currentTime - lastFrameTime < frameDelay) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      lastFrameTime = currentTime;

      // Black background with slight transparency for trailing effect
      ctx.fillStyle = `rgba(10, 10, 11, ${0.1 + (speed / 1000)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Matrix green text with brand color
      ctx.font = `${fontSize}px monospace`;

      // Loop through drops
      for (let i = 0; i < drops.length; i++) {
        // Pre-calculate random values to reduce per-frame calculations
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        const x = i * columnWidth;
        const y = drops[i] * fontSize;

        // Optimized opacity calculation
        const alpha = (Math.random() * 0.3 + 0.7) * opacity;
        ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
        ctx.fillText(text, x, y);

        // Reset drop if it reaches bottom with less random calculation
        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }

        // Move drop down
        drops[i]++;
      }

      animationId = requestAnimationFrame(draw);
    }

    // Start single animation loop
    animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [opacity, speed, fontSize, columns, characters]);

  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      right="0"
      bottom="0"
      zIndex="0"
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
}

// Simpler CSS-only matrix rain effect as fallback
export function CSSMatrixRain() {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';

  // Generate random character columns
  const generateColumns = (count: number) => {
    const cols = [];
    for (let i = 0; i < count; i++) {
      const columnChars = [];
      const charCount = Math.floor(Math.random() * 20) + 5;

      for (let j = 0; j < charCount; j++) {
        columnChars.push(characters[Math.floor(Math.random() * characters.length)]);
      }

      cols.push({
        chars: columnChars,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
        left: `${Math.random() * 100}%`,
      });
    }
    return cols;
  };

  generateColumns(50);

  return (
    <Box>
      {/* Note: This simplified version will need custom CSS for animations */}
      {/* In a real implementation, this would require a more complex solution */}
      {/* or acceptance of minimal inline styles for complex animations */}
    </Box>
  );
}