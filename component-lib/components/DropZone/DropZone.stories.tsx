import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  useDraggable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { DropZone } from "./DropZone";
import { DropZoneItem } from "./DropZoneItem";
import { DropZoneProvider } from "./DropZoneProvider";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { Card } from "../Card/Card";
import { Text } from "../Text/Text";
import { Box } from "../Box/Box";

const meta: Meta<typeof DropZone> = {
  title: "Components/DropZone",
  component: DropZone,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { DndContext } from '@dnd-kit/core';
import { DropZone, DropZoneItem } from '@mond-design-system/theme/client';

function PageBuilder() {
  const [items, setItems] = useState([]);

  function handleDragEnd(event) {
    const { active, over } = event;
    if (over?.id === 'dropzone') {
      // Add item to dropzone
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <DropZone id="dropzone">
        {items.map(item => (
          <DropZoneItem key={item.id} {...item}>
            <ComponentRenderer type={item.type} />
          </DropZoneItem>
        ))}
      </DropZone>
    </DndContext>
  );
}
\`\`\`

A drag-and-drop zone for building page layouts. Users can drag UI components onto the zone, reorder them, and remove them.

**Requirements:**
- Must be wrapped in \`DndContext\` from @dnd-kit/core
- Handles drag events via \`onDragEnd\` callback
- Uses \`DropZoneItem\` to wrap dropped components

**Key Features:**
- 🎯 Drag and drop components from palette
- 🔄 Reorder items within zone
- 🗑️ Remove items with button or drag-out
- 📋 Type validation (accepts specific component types)
- 🎨 Visual feedback during drag operations
- ♿ Full keyboard navigation support
- 🌙 Dark mode support
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    id: {
      control: "text",
      description: "Unique identifier for the drop zone",
    },
    accepts: {
      control: "object",
      description: "Array of accepted component types",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text when empty",
    },
    disabled: {
      control: "boolean",
      description: "Disable the drop zone",
    },
    minHeight: {
      control: "text",
      description: "Minimum height when empty",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper component for draggable palette items
function DraggableTemplate({
  id,
  type,
  label,
}: {
  id: string;
  type: string;
  label: string;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: { type, isTemplate: true },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        padding: "12px 16px",
        margin: "8px 0",
        border: "1px solid var(--mond-border-default)",
        borderRadius: "6px",
        backgroundColor: "var(--mond-surface-card)",
        cursor: isDragging ? "grabbing" : "grab",
        opacity: isDragging ? 0.5 : 1,
        userSelect: "none",
      }}
    >
      <Text variant="body-sm" weight="medium">
        {label}
      </Text>
    </div>
  );
}

// Component renderer for dropped items
function ComponentRenderer({ type }: { type: string }) {
  switch (type) {
    case "Button":
      return <Button>Sample Button</Button>;
    case "Input":
      return <Input placeholder="Sample Input" />;
    case "Card":
      return <Card title="Sample Card">test</Card>;
    case "Text":
      return <Text>Sample Text Component</Text>;
    case "Post":
      return <Text>Post Sample Component</Text>;
    default:
      return <div>{type}</div>;
  }
}

// Default empty story
export const Default: Story = {
  render: () => (
    <DropZoneProvider onDragEnd={() => {}}>
      <DropZone id="default-zone" minHeight="200px" />
    </DropZoneProvider>
  ),
};

// With item (single item since dropzone only accepts one)
export const WithItems: Story = {
  render: () => {
    const item = { id: "item-1", type: "Button" };

    return (
      <DropZoneProvider onDragEnd={() => {}}>
        <DropZone id="items-zone" minHeight="200px">
          <DropZoneItem key={item.id} id={item.id} type={item.type}>
            <ComponentRenderer type={item.type} />
          </DropZoneItem>
        </DropZone>
      </DropZoneProvider>
    );
  },
};

// Interactive demo with palette
export const InteractiveDemo: Story = {
  render: () => {
    const [canvasItems, setCanvasItems] = useState<
      Array<{ id: string; type: string }>
    >([]);
    const [activeId, setActiveId] = useState<string | null>(null);

    const componentTemplates = [
      { id: "btn-template", type: "Button", label: "Button" },
      { id: "input-template", type: "Input", label: "Input" },
      { id: "card-template", type: "Card", label: "Card" },
      { id: "text-template", type: "Text", label: "Text" },
    ];

    function handleDragStart(event: DragStartEvent) {
      setActiveId(String(event.active.id));
    }

    function handleDragEnd(event: DragEndEvent) {
      const { active, over } = event;
      setActiveId(null);

      // Only proceed if dropped over a valid droppable area
      if (!over) return;

      const activeData = active.data.current;

      // Drop from palette to canvas
      if (over.id === "canvas" && activeData?.isTemplate) {
        const newItem = {
          id: `${activeData.type}-${Date.now()}`,
          type: activeData.type,
        };
        // Replace existing item if any (swap)
        setCanvasItems([newItem]);
      }
    }

    function handleRemove(id: string) {
      setCanvasItems((prev) => prev.filter((item) => item.id !== id));
    }

    return (
      <DropZoneProvider
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        dragOverlay={
          activeId ? (
            <div
              style={{
                padding: "12px 16px",
                backgroundColor: "white",
                border: "2px solid var(--mond-border-primary)",
                borderRadius: "6px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              }}
            >
              Dragging...
            </div>
          ) : null
        }
      >
        <div style={{ display: "flex", gap: "32px", width: "800px" }}>
          {/* Component Palette */}
          <div style={{ width: "200px" }}>
            <Box marginBottom="3">
              <Text variant="body" weight="semibold">
                Components
              </Text>
            </Box>
            <div>
              {componentTemplates.map((template) => (
                <DraggableTemplate key={template.id} {...template} />
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div style={{ flex: 1 }}>
            <Box marginBottom="3">
              <Text variant="body" weight="semibold">
                Canvas
              </Text>
            </Box>
            <DropZone id="canvas" minHeight="400px">
              {canvasItems.map((item) => (
                <DropZoneItem
                  key={item.id}
                  id={item.id}
                  type={item.type}
                  onRemove={handleRemove}
                >
                  <ComponentRenderer type={item.type} />
                </DropZoneItem>
              ))}
            </DropZone>
          </div>
        </div>
      </DropZoneProvider>
    );
  },
};

// Simple Page Layout (recommended pattern)
export const PageLayout: Story = {
  render: () => {
    const [section1, setSection1] = useState<{
      id: string;
      type: string;
    } | null>({ id: "btn-1", type: "Button" });
    const [section2, setSection2] = useState<{
      id: string;
      type: string;
    } | null>(null);
    const [section3, setSection3] = useState<{
      id: string;
      type: string;
    } | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);

    const availableSegments = [
      { id: "form-segment", type: "Card", label: "Form Segment" },
      { id: "posts-segment", type: "Post", label: "Posts Segment" },
      { id: "hero-segment", type: "Button", label: "Hero Segment" },
    ];

    function handleDragStart(event: DragStartEvent) {
      setActiveId(String(event.active.id));
    }

    function handleDragEnd(event: DragEndEvent) {
      const { active, over } = event;
      if (!over) return;

      const activeData = active.data.current;

      // Only handle drops from the segment palette
      if (!activeData?.isTemplate) return;

      const newSegment = {
        id: `${activeData.type}-${Date.now()}`,
        type: activeData.type,
      };

      // Drop into specific sections
      if (over.id === "section-1") setSection1(newSegment);
      if (over.id === "section-2") setSection2(newSegment);
      if (over.id === "section-3") setSection3(newSegment);
    }

    return (
      <DropZoneProvider
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        dragOverlay={
          activeId ? (
            <div
              style={{
                padding: "12px 16px",
                backgroundColor: "white",
                border: "2px solid var(--mond-border-primary)",
                borderRadius: "6px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              }}
            >
              Dragging...
            </div>
          ) : null
        }
      >
        <div style={{ display: "flex", gap: "24px", width: "800px" }}>
          {/* Segment Palette */}
          <div style={{ width: "200px" }}>
            <Box marginBottom="3">
              <Text variant="body-sm" weight="semibold">
                Available Segments
              </Text>
            </Box>
            {availableSegments.map((segment) => (
              <DraggableTemplate key={segment.id} {...segment} />
            ))}
          </div>

          {/* Page Sections */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <Box marginBottom="2">
              <Text variant="body-sm" weight="semibold">
                Page Layout
              </Text>
            </Box>

            <DropZone id="section-1" minHeight="120px">
              {section1 && (
                <DropZoneItem
                  key={section1.id}
                  id={section1.id}
                  type={section1.type}
                  onRemove={() => setSection1(null)}
                >
                  <ComponentRenderer type={section1.type} />
                </DropZoneItem>
              )}
            </DropZone>

            <DropZone id="section-2" minHeight="120px">
              {section2 && (
                <DropZoneItem
                  key={section2.id}
                  id={section2.id}
                  type={section2.type}
                  onRemove={() => setSection2(null)}
                >
                  <ComponentRenderer type={section2.type} />
                </DropZoneItem>
              )}
            </DropZone>

            <DropZone id="section-3" minHeight="120px">
              {section3 && (
                <DropZoneItem
                  key={section3.id}
                  id={section3.id}
                  type={section3.type}
                  onRemove={() => setSection3(null)}
                >
                  <ComponentRenderer type={section3.type} />
                </DropZoneItem>
              )}
            </DropZone>
          </div>
        </div>
      </DropZoneProvider>
    );
  },
};

// Multiple zones (swap between zones)
export const MultipleZones: Story = {
  render: () => {
    const [zone1Items, setZone1Items] = useState<
      Array<{ id: string; type: string }>
    >([{ id: "item-1", type: "Button" }]);
    const [zone2Items, setZone2Items] = useState<
      Array<{ id: string; type: string }>
    >([{ id: "item-2", type: "Input" }]);

    function handleDragEnd(event: DragEndEvent) {
      const { active, over } = event;
      if (!over) return;

      const activeItem = [...zone1Items, ...zone2Items].find(
        (item) => item.id === active.id,
      );
      if (!activeItem) return;

      // Get the item from the target zone (if any) for swapping
      const zone1Item = zone1Items[0];
      const zone2Item = zone2Items[0];

      // Determine source zone
      const isFromZone1 = zone1Items.some((item) => item.id === active.id);
      const isFromZone2 = zone2Items.some((item) => item.id === active.id);

      // Handle drop on zone-1
      if (over.id === "zone-1") {
        if (isFromZone2) {
          // Swap: move activeItem to zone1, move zone1Item to zone2 (if exists)
          setZone1Items([activeItem]);
          setZone2Items(zone1Item ? [zone1Item] : []);
        }
      }
      // Handle drop on zone-2
      else if (over.id === "zone-2") {
        if (isFromZone1) {
          // Swap: move activeItem to zone2, move zone2Item to zone1 (if exists)
          setZone2Items([activeItem]);
          setZone1Items(zone2Item ? [zone2Item] : []);
        }
      }
    }

    return (
      <DropZoneProvider onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", gap: "24px", width: "600px" }}>
          <Box flex="1">
            <Box marginBottom="2">
              <Text variant="body-sm" weight="semibold">
                Zone 1
              </Text>
            </Box>
            <DropZone id="zone-1" minHeight="300px">
              {zone1Items.map((item) => (
                <DropZoneItem key={item.id} id={item.id} type={item.type}>
                  <ComponentRenderer type={item.type} />
                </DropZoneItem>
              ))}
            </DropZone>
          </Box>

          <Box flex="1">
            <Box marginBottom="2">
              <Text variant="body-sm" weight="semibold">
                Zone 2
              </Text>
            </Box>
            <DropZone id="zone-2" minHeight="300px">
              {zone2Items.map((item) => (
                <DropZoneItem key={item.id} id={item.id} type={item.type}>
                  <ComponentRenderer type={item.type} />
                </DropZoneItem>
              ))}
            </DropZone>
          </Box>
        </div>
      </DropZoneProvider>
    );
  },
};

// Disabled state
export const Disabled: Story = {
  render: () => (
    <DropZoneProvider onDragEnd={() => {}}>
      <DropZone
        id="disabled-zone"
        disabled
        placeholder="This zone is disabled"
        minHeight="200px"
      />
    </DropZoneProvider>
  ),
};

// Custom placeholder
export const CustomPlaceholder: Story = {
  render: () => (
    <DropZoneProvider onDragEnd={() => {}}>
      <DropZone
        id="custom-zone"
        placeholder="Drag your components here to build your page"
        minHeight="300px"
      />
    </DropZoneProvider>
  ),
};

// Restricted types (only accepts Button and Card)
export const RestrictedTypes: Story = {
  render: () => {
    const [item, setItem] = useState<{ id: string; type: string } | null>(null);

    const allTemplates = [
      { id: "btn-template", type: "Button", label: "Button (accepted)" },
      { id: "input-template", type: "Input", label: "Input (not accepted)" },
      { id: "card-template", type: "Card", label: "Card (accepted)" },
    ];

    function handleDragEnd(event: DragEndEvent) {
      const { active, over } = event;
      if (!over || over.id !== "restricted-zone") return;

      const activeData = active.data.current;
      if (!activeData?.isTemplate) return;

      // Only accept Button and Card
      if (["Button", "Card"].includes(activeData.type)) {
        const newItem = {
          id: `${activeData.type}-${Date.now()}`,
          type: activeData.type,
        };
        // Replace existing item if any (swap)
        setItem(newItem);
      }
    }

    function handleRemove() {
      setItem(null);
    }

    return (
      <DropZoneProvider onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", gap: "32px", width: "600px" }}>
          <div style={{ width: "200px" }}>
            <Box marginBottom="3">
              <Text variant="body-sm" weight="semibold">
                All Components
              </Text>
            </Box>
            {allTemplates.map((template) => (
              <DraggableTemplate key={template.id} {...template} />
            ))}
          </div>

          <div style={{ flex: 1 }}>
            <Box marginBottom="3">
              <Text variant="body-sm" weight="semibold">
                Only Accepts: Button, Card
              </Text>
            </Box>
            <DropZone
              id="restricted-zone"
              accepts={["Button", "Card"]}
              minHeight="300px"
            >
              {item && (
                <DropZoneItem
                  key={item.id}
                  id={item.id}
                  type={item.type}
                  onRemove={handleRemove}
                >
                  <ComponentRenderer type={item.type} />
                </DropZoneItem>
              )}
            </DropZone>
          </div>
        </div>
      </DropZoneProvider>
    );
  },
};
