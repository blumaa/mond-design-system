import React, { forwardRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Button } from '../Button/Button';
import { Box } from '../Box/Box';

export interface DropZoneItemProps {
  /**
   * Unique identifier for this item
   */
  id: string;

  /**
   * Component type (e.g., 'Button', 'Input', etc.)
   */
  type: string;

  /**
   * The component to render
   */
  children: React.ReactNode;

  /**
   * Callback when remove button is clicked
   */
  onRemove?: (id: string) => void;

  /**
   * Show remove button on hover
   * @default true
   */
  showRemoveButton?: boolean;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Test ID
   */
  'data-testid'?: string;
}

/**
 * DropZoneItem Component
 *
 * Wrapper for components dropped into a DropZone. Makes items draggable
 * and provides a remove button.
 *
 * @example
 * <DropZoneItem
 *   id="item-1"
 *   type="Button"
 *   onRemove={(id) => removeItem(id)}
 * >
 *   <Button>My Button</Button>
 * </DropZoneItem>
 */
export const DropZoneItem = forwardRef<HTMLDivElement, DropZoneItemProps>(
  (
    {
      id,
      type,
      children,
      onRemove,
      showRemoveButton = true,
      className = '',
      'data-testid': dataTestId,
    },
    ref
  ) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      isDragging,
    } = useDraggable({
      id,
      data: {
        type,
        isTemplate: false,
      },
    });

    // Build CSS classes
    const classNames = [
      'mond-dropzone__item',
      isDragging && 'mond-dropzone__item--dragging',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove?.(id);
    };

    return (
      <div
        ref={(node) => {
          setNodeRef(node);
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={classNames}
        data-testid={dataTestId}
        {...attributes}
        {...listeners}
      >
        <Box className="mond-dropzone__item-content">
          {children}
        </Box>

        {showRemoveButton && onRemove && (
          <Box className="mond-dropzone__item-remove">
            <Button
              variant="destructive"
              size="sm"
              iconOnly
              onClick={handleRemove}
              aria-label={`Remove ${type}`}
              data-testid={`${dataTestId || id}-remove`}
            >
              ×
            </Button>
          </Box>
        )}
      </div>
    );
  }
);

DropZoneItem.displayName = 'DropZoneItem';

export default DropZoneItem;
