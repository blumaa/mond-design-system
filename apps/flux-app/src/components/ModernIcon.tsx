'use client';
import React from 'react';
import { Box } from '@mond-design-system/theme';

interface ModernIconProps {
  type: 'festival' | 'star' | 'rainbow' | 'music' | 'wave' | 'lightning' | 'rocket' | 'crown' | 'keyboard' | 'diamond' | 'butterfly' | 'search' | 'trophy' | 'sparkle' | 'spaceship';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const sizeMap = {
  sm: '24px',
  md: '32px',
  lg: '48px',
  xl: '64px',
  '2xl': '96px'
};

export function ModernIcon({
  type,
  size = 'md',
  className
}: ModernIconProps) {
  const iconSize = sizeMap[size];

  const renderIcon = () => {
    switch (type) {
      case 'festival':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="festivalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e542ff" />
                <stop offset="50%" stopColor="#ff6b35" />
                <stop offset="100%" stopColor="#ffdd33" />
              </linearGradient>
              <filter id="glow">
                <feMorphology operator="dilate" radius="2"/>
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <circle cx="50" cy="50" r="40" fill="url(#festivalGrad)" filter="url(#glow)" opacity="0.9"/>
            <circle cx="50" cy="50" r="25" fill="none" stroke="white" strokeWidth="2" opacity="0.8"/>
            <circle cx="50" cy="50" r="12" fill="white" opacity="0.9"/>
          </svg>
        );

      case 'star':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffdd33" />
                <stop offset="100%" stopColor="#ff6b35" />
              </linearGradient>
            </defs>
            <path d="M50 10L58 38H88L66 56L74 84L50 66L26 84L34 56L12 38H42L50 10Z"
                  fill="url(#starGrad)"
                  style={{ filter: 'drop-shadow(0 4px 8px rgba(255,107,53,0.4))' }} />
          </svg>
        );

      case 'rainbow':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e542ff" />
                <stop offset="25%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="75%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <path d="M10 50C10 27.91 27.91 10 50 10C72.09 10 90 27.91 90 50H80C80 33.43 66.57 20 50 20C33.43 20 20 33.43 20 50H10Z"
                  fill="url(#rainbowGrad)"
                  style={{ filter: 'drop-shadow(0 4px 8px rgba(229,66,255,0.3))' }} />
            <path d="M25 50C25 40.34 33.34 32 43 32H57C66.66 32 75 40.34 75 50H65C65 45.86 61.64 42 57 42H43C38.36 42 35 45.86 35 50H25Z"
                  fill="url(#rainbowGrad)" opacity="0.7" />
          </svg>
        );

      case 'music':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="musicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e542ff" />
                <stop offset="100%" stopColor="#d420ff" />
              </linearGradient>
            </defs>
            <ellipse cx="35" cy="75" rx="12" ry="8" fill="url(#musicGrad)" style={{ filter: 'drop-shadow(0 2px 4px rgba(212,32,255,0.4))' }} />
            <ellipse cx="65" cy="65" rx="12" ry="8" fill="url(#musicGrad)" style={{ filter: 'drop-shadow(0 2px 4px rgba(212,32,255,0.4))' }} />
            <rect x="45" y="20" width="4" height="45" fill="url(#musicGrad)" />
            <rect x="75" y="20" width="4" height="45" fill="url(#musicGrad)" />
          </svg>
        );

      case 'wave':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <path d="M10 50C20 30 30 70 40 50C50 30 60 70 70 50C80 30 90 70 90 50"
                  stroke="url(#waveGrad)"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 2px 6px rgba(59,130,246,0.4))' }} />
          </svg>
        );

      case 'lightning':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="lightningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffdd33" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <path d="M55 10L25 45H45L35 90L65 55H45L55 10Z"
                  fill="url(#lightningGrad)"
                  style={{ filter: 'drop-shadow(0 4px 8px rgba(245,158,11,0.4))' }} />
          </svg>
        );

      case 'rocket':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ffdd33" />
              </linearGradient>
            </defs>
            <ellipse cx="50" cy="30" rx="15" ry="25" fill="url(#rocketGrad)" style={{ filter: 'drop-shadow(0 4px 8px rgba(239,68,68,0.4))' }} />
            <path d="M35 55L50 80L65 55L50 45Z" fill="url(#rocketGrad)" opacity="0.8" />
            <circle cx="50" cy="25" r="5" fill="white" opacity="0.9" />
          </svg>
        );

      case 'crown':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffdd33" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <path d="M20 60L15 30L35 45L50 20L65 45L85 30L80 60H20Z"
                  fill="url(#crownGrad)"
                  style={{ filter: 'drop-shadow(0 4px 8px rgba(245,158,11,0.4))' }} />
            <circle cx="50" cy="35" r="3" fill="white" opacity="0.9" />
          </svg>
        );

      case 'keyboard':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="keyboardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#e542ff" />
              </linearGradient>
            </defs>
            <rect x="15" y="40" width="70" height="30" rx="5" fill="url(#keyboardGrad)" style={{ filter: 'drop-shadow(0 4px 8px rgba(139,92,246,0.4))' }} />
            <rect x="20" y="45" width="8" height="6" rx="2" fill="white" opacity="0.8" />
            <rect x="32" y="45" width="8" height="6" rx="2" fill="white" opacity="0.8" />
            <rect x="44" y="45" width="8" height="6" rx="2" fill="white" opacity="0.8" />
            <rect x="56" y="45" width="8" height="6" rx="2" fill="white" opacity="0.8" />
          </svg>
        );

      case 'diamond':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <path d="M35 20L65 20L80 40L50 80L20 40L35 20Z"
                  fill="url(#diamondGrad)"
                  style={{ filter: 'drop-shadow(0 4px 8px rgba(59,130,246,0.4))' }} />
            <path d="M35 20L50 40L65 20L50 30Z" fill="white" opacity="0.3" />
          </svg>
        );

      case 'butterfly':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="butterflyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e542ff" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ffdd33" />
              </linearGradient>
            </defs>
            <ellipse cx="35" cy="35" rx="15" ry="20" fill="url(#butterflyGrad)" style={{ filter: 'drop-shadow(0 2px 4px rgba(229,66,255,0.4))' }} />
            <ellipse cx="65" cy="35" rx="15" ry="20" fill="url(#butterflyGrad)" style={{ filter: 'drop-shadow(0 2px 4px rgba(229,66,255,0.4))' }} />
            <ellipse cx="35" cy="65" rx="12" ry="15" fill="url(#butterflyGrad)" opacity="0.8" />
            <ellipse cx="65" cy="65" rx="12" ry="15" fill="url(#butterflyGrad)" opacity="0.8" />
            <rect x="48" y="20" width="4" height="60" fill="#4a4a4a" rx="2" />
            <circle cx="50" cy="15" r="3" fill="#4a4a4a" />
          </svg>
        );

      case 'search':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="searchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <circle cx="40" cy="40" r="25" fill="none" stroke="url(#searchGrad)" strokeWidth="6" style={{ filter: 'drop-shadow(0 2px 4px rgba(59,130,246,0.4))' }} />
            <path d="M60 60L80 80" stroke="url(#searchGrad)" strokeWidth="6" strokeLinecap="round" style={{ filter: 'drop-shadow(0 2px 4px rgba(59,130,246,0.4))' }} />
          </svg>
        );

      case 'trophy':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="trophyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffdd33" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <rect x="35" y="75" width="30" height="8" fill="url(#trophyGrad)" />
            <rect x="45" y="60" width="10" height="15" fill="url(#trophyGrad)" />
            <ellipse cx="50" cy="40" rx="20" ry="25" fill="url(#trophyGrad)" style={{ filter: 'drop-shadow(0 4px 8px rgba(245,158,11,0.4))' }} />
            <path d="M25 35C25 30 30 25 35 25V45C30 45 25 40 25 35Z" fill="url(#trophyGrad)" opacity="0.8" />
            <path d="M75 35C75 30 70 25 65 25V45C70 45 75 40 75 35Z" fill="url(#trophyGrad)" opacity="0.8" />
          </svg>
        );

      case 'sparkle':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffdd33" />
                <stop offset="100%" stopColor="#ff6b35" />
              </linearGradient>
            </defs>
            <path d="M50 10L52 25L67 22L55 35L70 45L52 40L50 55L48 40L30 45L45 35L33 22L48 25Z" fill="url(#sparkleGrad)" style={{ filter: 'drop-shadow(0 2px 6px rgba(255,107,53,0.4))' }} />
            <circle cx="75" cy="25" r="3" fill="url(#sparkleGrad)" />
            <circle cx="25" cy="75" r="2" fill="url(#sparkleGrad)" opacity="0.8" />
            <circle cx="80" cy="70" r="2" fill="url(#sparkleGrad)" opacity="0.6" />
          </svg>
        );

      case 'spaceship':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="spaceshipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <ellipse cx="50" cy="35" rx="12" ry="20" fill="url(#spaceshipGrad)" style={{ filter: 'drop-shadow(0 4px 8px rgba(139,92,246,0.4))' }} />
            <path d="M38 55L50 70L62 55L50 50Z" fill="url(#spaceshipGrad)" opacity="0.8" />
            <circle cx="50" cy="30" r="4" fill="white" opacity="0.9" />
            <rect x="30" y="45" width="8" height="15" rx="4" fill="url(#spaceshipGrad)" opacity="0.6" />
            <rect x="62" y="45" width="8" height="15" rx="4" fill="url(#spaceshipGrad)" opacity="0.6" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      width={iconSize}
      height={iconSize}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      className={className}
    >
      {renderIcon()}
    </Box>
  );
}