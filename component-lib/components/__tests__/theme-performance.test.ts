/**
 * Theme Switching Performance Tests - Phase 3.1
 * 
 * Tests theme switching performance to ensure <1ms average resolution time
 * as specified in the project requirements.
 */

import { createThemeResolver } from '../../utils/themeResolver';
import { mondTheme } from '../../brands/mond';
import { cypherTheme } from '../../brands/cypher';
import { fluxTheme } from '../../brands/flux';
import type { BrandTheme } from '../providers/ThemeProvider';

describe('Theme Switching Performance - Phase 3.1', () => {
  const brands: Array<{ name: string; theme: BrandTheme }> = [
    { name: 'MOND', theme: mondTheme },
    { name: 'CYPHER', theme: cypherTheme },
    { name: 'FLUX', theme: fluxTheme },
  ];

  const testTokenPaths = [
    'text.primary',
    'surface.background',
    'interactive.primary.background',
    'feedback.success.background',
    'border.default',
    'effects.shadow.md',
    'brand.interactive.background',
    'brand.interactive.text',
  ];

  describe('Token Resolution Performance (<1ms requirement)', () => {
    it('should resolve theme tokens in <1ms average (light mode)', () => {
      const performanceResults: number[] = [];

      brands.forEach(({ name, theme }) => {
        const resolver = createThemeResolver('light', theme);
        
        // Warm up the resolver (first calls might be slower due to initialization)
        testTokenPaths.forEach(path => resolver(path));
        
        // Measure actual performance over many iterations
        const iterations = 1000;
        const startTime = performance.now();
        
        for (let i = 0; i < iterations; i++) {
          testTokenPaths.forEach(path => {
            resolver(path);
          });
        }
        
        const endTime = performance.now();
        const totalTime = endTime - startTime;
        const averageTime = totalTime / (iterations * testTokenPaths.length);
        
        performanceResults.push(averageTime);
        
        console.log(`${name} theme resolution: ${averageTime.toFixed(4)}ms average`);
        
        // Each brand should resolve tokens in <1ms on average
        expect(averageTime).toBeLessThan(1);
      });

      // Overall average across all brands should be <1ms
      const overallAverage = performanceResults.reduce((a, b) => a + b) / performanceResults.length;
      console.log(`Overall average theme resolution: ${overallAverage.toFixed(4)}ms`);
      expect(overallAverage).toBeLessThan(1);
    });

    it('should resolve theme tokens in <1ms average (dark mode)', () => {
      const performanceResults: number[] = [];

      brands.forEach(({ name, theme }) => {
        const resolver = createThemeResolver('dark', theme);
        
        // Warm up the resolver
        testTokenPaths.forEach(path => resolver(path));
        
        // Measure performance
        const iterations = 1000;
        const startTime = performance.now();
        
        for (let i = 0; i < iterations; i++) {
          testTokenPaths.forEach(path => {
            resolver(path);
          });
        }
        
        const endTime = performance.now();
        const totalTime = endTime - startTime;
        const averageTime = totalTime / (iterations * testTokenPaths.length);
        
        performanceResults.push(averageTime);
        
        console.log(`${name} theme resolution (dark): ${averageTime.toFixed(4)}ms average`);
        
        // Each brand should resolve tokens in <1ms on average
        expect(averageTime).toBeLessThan(1);
      });

      // Overall average should be <1ms
      const overallAverage = performanceResults.reduce((a, b) => a + b) / performanceResults.length;
      console.log(`Overall average theme resolution (dark): ${overallAverage.toFixed(4)}ms`);
      expect(overallAverage).toBeLessThan(1);
    });
  });

  describe('Theme Switching Speed', () => {
    it('should switch between brands efficiently', () => {
      const switchTimes: number[] = [];
      
      // Test switching between different brand themes
      const brandPairs = [
        ['MOND → CYPHER', mondTheme, cypherTheme],
        ['CYPHER → FLUX', cypherTheme, fluxTheme], 
        ['FLUX → MOND', fluxTheme, mondTheme],
      ] as const;

      brandPairs.forEach(([label, brandA, brandB]) => {
        const startTime = performance.now();
        
        // Create first resolver
        const resolverA = createThemeResolver('light', brandA);
        testTokenPaths.forEach(path => resolverA(path));
        
        // Switch to second brand (simulate user changing brand)
        const resolverB = createThemeResolver('light', brandB);
        testTokenPaths.forEach(path => resolverB(path));
        
        const endTime = performance.now();
        const switchTime = endTime - startTime;
        
        switchTimes.push(switchTime);
        
        console.log(`Brand switch ${label}: ${switchTime.toFixed(4)}ms`);
        
        // Brand switching should be reasonably fast
        expect(switchTime).toBeLessThan(10); // Allow 10ms for complete brand switch
      });

      const averageSwitchTime = switchTimes.reduce((a, b) => a + b) / switchTimes.length;
      console.log(`Average brand switch time: ${averageSwitchTime.toFixed(4)}ms`);
      expect(averageSwitchTime).toBeLessThan(5);
    });

    it('should switch between light/dark modes efficiently', () => {
      const switchTimes: number[] = [];
      
      brands.forEach(({ name, theme }) => {
        const startTime = performance.now();
        
        // Create light resolver
        const lightResolver = createThemeResolver('light', theme);
        testTokenPaths.forEach(path => lightResolver(path));
        
        // Switch to dark mode (simulate user toggling theme)
        const darkResolver = createThemeResolver('dark', theme);
        testTokenPaths.forEach(path => darkResolver(path));
        
        const endTime = performance.now();
        const switchTime = endTime - startTime;
        
        switchTimes.push(switchTime);
        
        console.log(`${name} light/dark switch: ${switchTime.toFixed(4)}ms`);
        
        // Mode switching should be very fast
        expect(switchTime).toBeLessThan(5); // Allow 5ms for complete mode switch
      });

      const averageSwitchTime = switchTimes.reduce((a, b) => a + b) / switchTimes.length;
      console.log(`Average light/dark switch time: ${averageSwitchTime.toFixed(4)}ms`);
      expect(averageSwitchTime).toBeLessThan(3);
    });
  });

  describe('High-Frequency Usage Scenarios', () => {
    it('should handle rapid token lookups without performance degradation', () => {
      const resolver = createThemeResolver('light', mondTheme);
      const iterations = 10000; // High frequency usage
      
      const startTime = performance.now();
      
      // Simulate component rendering scenario - many rapid token lookups
      for (let i = 0; i < iterations; i++) {
        resolver('interactive.primary.background');
        resolver('interactive.primary.text');
        resolver('text.primary');
        resolver('surface.background');
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const averageTime = totalTime / (iterations * 4);
      
      console.log(`High-frequency token lookup: ${averageTime.toFixed(4)}ms average`);
      
      // Should maintain sub-millisecond performance even under high load
      expect(averageTime).toBeLessThan(0.5);
    });

    it('should maintain performance with concurrent access', () => {
      const resolver = createThemeResolver('light', cypherTheme);
      const concurrentRequests = 100;
      const tokensPerRequest = testTokenPaths.length;
      
      const startTime = performance.now();
      
      // Simulate multiple components accessing theme concurrently
      const promises = Array.from({ length: concurrentRequests }, () => {
        return new Promise<void>((resolve) => {
          // Simulate async component rendering
          setTimeout(() => {
            testTokenPaths.forEach(path => resolver(path));
            resolve();
          }, Math.random() * 10);
        });
      });
      
      return Promise.all(promises).then(() => {
        const endTime = performance.now();
        const totalTime = endTime - startTime;
        const averageTime = totalTime / (concurrentRequests * tokensPerRequest);
        
        console.log(`Concurrent access average: ${averageTime.toFixed(4)}ms`);
        
        // Should handle concurrency well
        expect(averageTime).toBeLessThan(2);
      });
    });
  });

  describe('Memory Efficiency', () => {
    it('should not cause memory leaks during repeated theme switches', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Perform many theme creation/destruction cycles
      for (let i = 0; i < 1000; i++) {
        const theme = brands[i % brands.length].theme;
        const resolver = createThemeResolver(i % 2 === 0 ? 'light' : 'dark', theme);
        
        // Use the resolver
        testTokenPaths.forEach(path => resolver(path));
      }
      
      // Force garbage collection if available
      if ((global as any).gc) {
        (global as any).gc();
      }
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      if (initialMemory > 0) {
        const memoryIncrease = finalMemory - initialMemory;
        console.log(`Memory increase after 1000 theme switches: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
        
        // Memory increase should be reasonable (less than 5MB for 1000 switches)
        expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);
      }
    });
  });

  describe('Real-World Performance Scenarios', () => {
    it('should perform well in typical component rendering scenario', () => {
      // Simulate a complex component that uses many theme tokens
      const componentTokens = [
        'surface.background',
        'text.primary',
        'text.secondary', 
        'border.default',
        'interactive.primary.background',
        'interactive.primary.text',
        'interactive.primary.backgroundHover',
        'effects.shadow.md',
        'brand.interactive.background',
        'feedback.success.background',
      ];

      brands.forEach(({ name, theme }) => {
        ['light', 'dark'].forEach(mode => {
          const resolver = createThemeResolver(mode as 'light' | 'dark', theme);
          const iterations = 100;
          
          const startTime = performance.now();
          
          // Simulate rendering 100 complex components
          for (let i = 0; i < iterations; i++) {
            componentTokens.forEach(token => resolver(token));
          }
          
          const endTime = performance.now();
          const totalTime = endTime - startTime;
          const averagePerComponent = totalTime / iterations;
          const averagePerToken = totalTime / (iterations * componentTokens.length);
          
          console.log(`${name} ${mode} - Complex component render: ${averagePerComponent.toFixed(4)}ms per component, ${averagePerToken.toFixed(4)}ms per token`);
          
          // Component should resolve all its tokens quickly
          expect(averagePerComponent).toBeLessThan(5); // 5ms per component
          expect(averagePerToken).toBeLessThan(0.5); // 0.5ms per token
        });
      });
    });
  });
});