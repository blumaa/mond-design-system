import { useEffect, useState } from 'react';
import { Box } from '@mond-design-system/theme';

export function PulseAnimation() {
  const [pulses, setPulses] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number; type: 'primary' | 'secondary' | 'accent'; intensity: number }>>([]);

  useEffect(() => {
    // Create random pulse positions with varying sizes and types
    const newPulses = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 6000,
      size: 8 + Math.random() * 40,
      type: (['primary', 'secondary', 'accent'] as const)[Math.floor(Math.random() * 3)],
      intensity: 0.3 + Math.random() * 0.4,
    }));
    setPulses(newPulses);
  }, []);

  return (
    <>
      {/* CSS for animations */}
      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(0.6) rotate(0deg);
            opacity: 0.8;
          }
          25% {
            transform: scale(0.9) rotate(90deg);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.4) rotate(180deg);
            opacity: 0.3;
          }
          75% {
            transform: scale(1.1) rotate(270deg);
            opacity: 0.5;
          }
          100% {
            transform: scale(0.6) rotate(360deg);
            opacity: 0.8;
          }
        }
        @keyframes glow {
          0%, 100% {
            filter: blur(1px) saturate(1.2);
            opacity: 0.4;
          }
          33% {
            filter: blur(6px) saturate(1.8);
            opacity: 0.7;
          }
          66% {
            filter: blur(3px) saturate(1.5);
            opacity: 0.6;
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-10px) translateX(5px);
          }
          50% {
            transform: translateY(5px) translateX(-8px);
          }
          75% {
            transform: translateY(-5px) translateX(3px);
          }
        }
        @keyframes backgroundShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .pulse-dot {
          animation: pulse 4s ease-in-out infinite, glow 3s ease-in-out infinite, float 8s ease-in-out infinite;
          will-change: transform, opacity, filter;
        }
        .background-gradient {
          background: linear-gradient(270deg,
            rgba(229, 66, 255, 0.05) 0%,
            rgba(255, 221, 51, 0.03) 25%,
            rgba(16, 185, 129, 0.04) 50%,
            rgba(239, 68, 68, 0.03) 75%,
            rgba(229, 66, 255, 0.05) 100%
          );
          background-size: 400% 400%;
          animation: backgroundShift 20s ease-in-out infinite;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -2;
        }
      `}</style>

      <Box
        position="fixed"
        top="0"
        left="0"
        width="100vw"
        height="100vh"
        zIndex="-1"
        overflow="hidden"
      >
        {/* Dynamic gradient background */}
        <div className="background-gradient" />

        {/* Enhanced pulse dots */}
        {pulses.map((pulse) => {
          const gradientColors = {
            primary: `radial-gradient(circle, rgba(229, 66, 255, ${pulse.intensity}) 0%, rgba(229, 66, 255, ${pulse.intensity * 0.3}) 60%, transparent 100%)`,
            secondary: `radial-gradient(circle, rgba(255, 221, 51, ${pulse.intensity}) 0%, rgba(255, 221, 51, ${pulse.intensity * 0.3}) 60%, transparent 100%)`,
            accent: `radial-gradient(circle, rgba(16, 185, 129, ${pulse.intensity}) 0%, rgba(16, 185, 129, ${pulse.intensity * 0.3}) 60%, transparent 100%)`
          };

          return (
            <Box
              key={pulse.id}
              className="pulse-dot"
              position="absolute"
              left={`${pulse.x}%`}
              top={`${pulse.y}%`}
              width={`${pulse.size}px`}
              height={`${pulse.size}px`}
              borderRadius="full"
              style={{
                animationDelay: `${pulse.delay}ms, ${pulse.delay + 500}ms, ${pulse.delay + 1000}ms`,
                background: gradientColors[pulse.type],
                boxShadow: `0 0 ${pulse.size * 0.5}px rgba(229, 66, 255, ${pulse.intensity * 0.5})`,
              }}
            />
          );
        })}

        {/* Large ambient gradient orbs */}
        <Box
          position="absolute"
          top="10%"
          right="15%"
          width="120px"
          height="120px"
          borderRadius="full"
          style={{
            background: `conic-gradient(from 0deg at 50% 50%, rgba(229, 66, 255, 0.2) 0deg, rgba(255, 221, 51, 0.15) 120deg, rgba(16, 185, 129, 0.2) 240deg, rgba(229, 66, 255, 0.2) 360deg)`,
            animation: 'pulse 6s ease-in-out infinite, float 12s ease-in-out infinite',
            animationDelay: '1s',
            filter: 'blur(2px)',
          }}
        />
        <Box
          position="absolute"
          bottom="20%"
          left="10%"
          width="80px"
          height="80px"
          borderRadius="full"
          style={{
            background: `radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, rgba(239, 68, 68, 0.1) 50%, transparent 80%)`,
            animation: 'glow 4s ease-in-out infinite, float 10s ease-in-out infinite reverse',
            animationDelay: '2s',
            filter: 'blur(1px)',
          }}
        />
        <Box
          position="absolute"
          top="60%"
          right="25%"
          width="150px"
          height="150px"
          borderRadius="full"
          style={{
            background: `linear-gradient(135deg, rgba(255, 221, 51, 0.1) 0%, rgba(16, 185, 129, 0.15) 100%)`,
            animation: 'pulse 8s ease-in-out infinite, float 15s ease-in-out infinite',
            animationDelay: '3s',
            filter: 'blur(3px)',
          }}
        />
      </Box>
    </>
  );
}