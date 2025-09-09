'use client';
import React, { useEffect, useRef, useState, forwardRef, useCallback } from 'react';
import { Box } from '../../layout/Box/Box';
import { useTheme } from '../../../utils/theme';

export interface BottomSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the bottom sheet is open
   */
  isOpen: boolean;
  
  /**
   * Callback fired when the bottom sheet requests to be closed
   */
  onClose: () => void;
  
  /**
   * Size of the bottom sheet
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'full';
  
  /**
   * Whether to show drag handle
   * @default true
   */
  showDragHandle?: boolean;
  
  /**
   * Whether to enable drag to close
   * @default true
   */
  enableDragToClose?: boolean;
  
  /**
   * Whether to close on overlay click
   * @default true
   */
  closeOnOverlayClick?: boolean;
  
  /**
   * Whether to close on escape key
   * @default true
   */
  closeOnEscapeKey?: boolean;
  
  /**
   * Dark mode support
   */
  isDarkMode?: boolean;
  
  /**
   * Content of the bottom sheet
   */
  children: React.ReactNode;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

const getSizeStyles = (size: BottomSheetProps['size']) => {
  switch (size) {
    case 'sm':
      return { maxHeight: '30vh', minHeight: '200px' };
    case 'md':
      return { maxHeight: '50vh', minHeight: '300px' };
    case 'lg':
      return { maxHeight: '70vh', minHeight: '400px' };
    case 'full':
      return { maxHeight: '90vh', minHeight: '60vh' };
    default:
      return { maxHeight: '50vh', minHeight: '300px' };
  }
};

export const BottomSheet = forwardRef<HTMLDivElement, BottomSheetProps>(
  (
    {
      isOpen,
      onClose,
      size = 'md',
      showDragHandle = true,
      enableDragToClose = true,
      closeOnOverlayClick = true,
      closeOnEscapeKey = true,
      isDarkMode,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const theme = useTheme(isDarkMode);
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [dragY, setDragY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const sheetRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const dragStartY = useRef(0);
    
    const sizeStyles = getSizeStyles(size);
    
    // Handle open/close animations
    useEffect(() => {
      if (isOpen) {
        setIsVisible(true);
        setIsAnimating(true);
        // Delay to allow for entrance animation
        setTimeout(() => setIsAnimating(false), 300);
      } else if (isVisible) {
        setIsAnimating(true);
        // Delay to allow for exit animation
        setTimeout(() => {
          setIsVisible(false);
          setIsAnimating(false);
          setDragY(0);
        }, 300);
      }
    }, [isOpen, isVisible]);
    
    // Handle escape key
    useEffect(() => {
      const handleEscapeKey = (event: KeyboardEvent) => {
        if (closeOnEscapeKey && event.key === 'Escape' && isOpen) {
          onClose();
        }
      };
      
      if (isOpen) {
        document.addEventListener('keydown', handleEscapeKey);
        return () => document.removeEventListener('keydown', handleEscapeKey);
      }
    }, [isOpen, closeOnEscapeKey, onClose]);
    
    // Handle body scroll lock
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = '';
        };
      }
    }, [isOpen]);
    
    // Drag handlers
    const handleDragStart = (clientY: number) => {
      if (!enableDragToClose) return;
      setIsDragging(true);
      dragStartY.current = clientY;
    };
    
    const handleDragMove = useCallback((clientY: number) => {
      if (!isDragging || !enableDragToClose) return;
      const deltaY = clientY - dragStartY.current;
      const newDragY = Math.max(0, deltaY);
      setDragY(newDragY);
    }, [isDragging, enableDragToClose]);
    
    const handleDragEnd = useCallback(() => {
      if (!isDragging || !enableDragToClose) return;
      setIsDragging(false);
      
      // If dragged down more than 100px, close the sheet
      if (dragY > 100) {
        onClose();
      } else {
        setDragY(0);
      }
    }, [isDragging, enableDragToClose, dragY, onClose]);
    
    // Mouse events
    const handleMouseDown = (event: React.MouseEvent) => {
      handleDragStart(event.clientY);
    };
    
    const handleMouseMove = useCallback((event: MouseEvent) => {
      handleDragMove(event.clientY);
    }, [handleDragMove]);
    
    const handleMouseUp = useCallback(() => {
      handleDragEnd();
    }, [handleDragEnd]);
    
    // Touch events
    const handleTouchStart = (event: React.TouchEvent) => {
      handleDragStart(event.touches[0].clientY);
    };
    
    const handleTouchMove = useCallback((event: TouchEvent) => {
      handleDragMove(event.touches[0].clientY);
    }, [handleDragMove]);
    
    const handleTouchEnd = useCallback(() => {
      handleDragEnd();
    }, [handleDragEnd]);
    
    // Global event listeners for drag
    useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
        
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
          document.removeEventListener('touchmove', handleTouchMove);
          document.removeEventListener('touchend', handleTouchEnd);
        };
      }
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);
    
    const handleOverlayClick = (event: React.MouseEvent) => {
      if (closeOnOverlayClick && event.target === overlayRef.current) {
        onClose();
      }
    };
    
    if (!isVisible) return null;
    
    return (
      <Box
        ref={overlayRef}
        onClick={handleOverlayClick}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: `rgba(0, 0, 0, ${isOpen && !isAnimating ? 0.5 : 0})`,
          transition: 'background-color 0.3s ease',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
        className="bottom-sheet-overlay"
      >
        <Box
          ref={ref || sheetRef}
          className={`bottom-sheet ${className}`}
          style={{
            backgroundColor: theme('surface.secondary'),
            borderRadius: '16px 16px 0 0',
            width: '100%',
            maxWidth: '600px',
            ...sizeStyles,
            transform: `translateY(${
              !isOpen || isAnimating
                ? isOpen
                  ? '100%'
                  : '100%'
                : `${dragY}px`
            })`,
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
            boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
          {...props}
        >
          {showDragHandle && (
            <Box
              className="bottom-sheet-drag-handle"
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '12px',
                cursor: enableDragToClose ? 'grab' : 'default',
                touchAction: 'none',
              }}
            >
              <Box
                style={{
                  width: '40px',
                  height: '4px',
                  backgroundColor: theme('border.secondary'),
                  borderRadius: '2px',
                  opacity: 0.6,
                }}
              />
            </Box>
          )}
          
          <Box
            className="bottom-sheet-content"
            style={{
              flex: 1,
              overflow: 'auto',
              padding: showDragHandle ? '0 24px 24px 24px' : '24px',
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    );
  }
);

BottomSheet.displayName = 'BottomSheet';

// Sub-components for structured content
export interface BottomSheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isDarkMode?: boolean;
}

export const BottomSheetHeader = forwardRef<HTMLDivElement, BottomSheetHeaderProps>(
  ({ children, isDarkMode = false, className = '', ...props }, ref) => {
    const theme = useTheme(isDarkMode);
    
    return (
      <Box
        ref={ref}
        className={`bottom-sheet-header ${className}`}
        style={{
          paddingBottom: '16px',
          borderBottom: `1px solid ${
            theme('border.primary')
          }`,
          marginBottom: '16px',
        }}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

BottomSheetHeader.displayName = 'BottomSheetHeader';

export interface BottomSheetBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const BottomSheetBody = forwardRef<HTMLDivElement, BottomSheetBodyProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <Box
        ref={ref}
        className={`bottom-sheet-body ${className}`}
        style={{
          flex: 1,
          overflow: 'auto',
        }}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

BottomSheetBody.displayName = 'BottomSheetBody';

export interface BottomSheetFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isDarkMode?: boolean;
}

export const BottomSheetFooter = forwardRef<HTMLDivElement, BottomSheetFooterProps>(
  ({ children, isDarkMode = false, className = '', ...props }, ref) => {
    const theme = useTheme(isDarkMode);
    
    return (
      <Box
        ref={ref}
        className={`bottom-sheet-footer ${className}`}
        style={{
          paddingTop: '16px',
          borderTop: `1px solid ${
            theme('border.primary')
          }`,
          marginTop: '16px',
        }}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

BottomSheetFooter.displayName = 'BottomSheetFooter';