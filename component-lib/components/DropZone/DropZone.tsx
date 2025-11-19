import React, { forwardRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { DropZonePlaceholder } from './DropZonePlaceholder';
import './dropzone.css';

export interface ComponentData {
  id: string;
  type: string;
  props?: Record<string, unknown>;
  isTemplate: boolean;
}

export interface DropZoneProps {
  /**
   * Unique identifier for this drop zone
   */
  id: string;

  /**
   * Currently dropped components (controlled)
   */
  children?: React.ReactNode;

  /**
   * Component types this zone accepts
   * @default ['Button', 'Input', 'Card', 'Text']
   */
  accepts?: string[];

  /**
   * Placeholder text when empty
   * @default 'Drop components here'
   */
  placeholder?: string;

  /**
   * Whether the zone is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Minimum height when empty (optional)
   * If not specified, the DropZone will fit parent dimensions
   */
  minHeight?: string;

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
 * DropZone Component
 *
 * A drag-and-drop zone for building page layouts. Users can drag UI components
 * onto the zone, reorder them, and remove them.
 *
 * **Requires DndContext** - Must be wrapped in a DndContext provider from @dnd-kit/core
 *
 * @example
 * // Basic usage
 * <DndContext onDragEnd={handleDragEnd}>
 *   <DropZone id="main-zone">
 *     {items.map(item => (
 *       <DropZoneItem key={item.id} {...item}>
 *         <ComponentRenderer type={item.type} />
 *       </DropZoneItem>
 *     ))}
 *   </DropZone>
 * </DndContext>
 *
 * @example
 * // With type restrictions
 * <DropZone
 *   id="button-zone"
 *   accepts={['Button']}
 *   placeholder="Drop buttons here"
 * >
 *   {children}
 * </DropZone>
 */
export const DropZone = forwardRef<HTMLDivElement, DropZoneProps>(
  (
    {
      id,
      children,
      accepts = ['Button', 'Input', 'Card', 'Text'],
      placeholder = 'Drop components here',
      disabled = false,
      minHeight,
      className = '',
      'data-testid': dataTestId,
    },
    ref
  ) => {
    // Check if zone is occupied
    const childArray = React.Children.toArray(children);
    const isOccupied = childArray.length > 0;

    const { setNodeRef, isOver, active } = useDroppable({
      id,
      disabled, // Only disable if explicitly disabled, not when occupied
      data: {
        accepts,
        isOccupied,
      },
    });

    // Check if the dragged item is accepted by this zone
    const draggedType = active?.data.current?.type;
    const isValidDrop = draggedType && accepts.includes(draggedType);
    const showOverState = isOver && isValidDrop;

    // Build CSS classes
    const isEmpty = childArray.length === 0;
    const classNames = [
      'mond-dropzone',
      isEmpty && 'mond-dropzone--empty',
      showOverState && 'mond-dropzone--over',
      disabled && 'mond-dropzone--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const style = {
      minHeight: isEmpty ? minHeight : undefined,
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
        style={style}
        data-testid={dataTestId}
        data-dropzone-id={id}
      >
        {isEmpty ? (
          <DropZonePlaceholder
            text={placeholder}
            isOver={showOverState}
            isValidDrop={isValidDrop}
          />
        ) : (
          children
        )}
      </div>
    );
  }
);

DropZone.displayName = 'DropZone';

export default DropZone;
