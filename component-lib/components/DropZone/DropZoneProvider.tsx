import React from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  pointerWithin,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';

export interface DropZoneProviderProps {
  /**
   * Child components (typically DropZones)
   */
  children: React.ReactNode;

  /**
   * Callback when drag ends - handle your drop/swap logic here
   */
  onDragEnd: (event: DragEndEvent) => void;

  /**
   * Optional callback when drag starts
   */
  onDragStart?: (event: DragStartEvent) => void;

  /**
   * Optional custom drag overlay content
   */
  dragOverlay?: React.ReactNode;
}

/**
 * DropZoneProvider Component
 *
 * Wraps your DropZones with the necessary drag-and-drop context.
 * Handles all the dnd-kit setup so you don't have to.
 *
 * @example
 * <DropZoneProvider onDragEnd={handleDragEnd}>
 *   <DropZone id="section-1">
 *     {section1Content}
 *   </DropZone>
 *   <DropZone id="section-2">
 *     {section2Content}
 *   </DropZone>
 * </DropZoneProvider>
 */
export const DropZoneProvider: React.FC<DropZoneProviderProps> = ({
  children,
  onDragEnd,
  onDragStart,
  dragOverlay,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Drag 8px before activating
      },
    }),
    useSensor(KeyboardSensor)
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {children}
      {dragOverlay && <DragOverlay>{dragOverlay}</DragOverlay>}
    </DndContext>
  );
};

DropZoneProvider.displayName = 'DropZoneProvider';

export default DropZoneProvider;
