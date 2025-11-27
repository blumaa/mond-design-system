import React from "react";
import { Box } from "../Box/Box";
import { Text } from "../Text/Text";
import { Icon } from "../Icon/Icon";

export interface DropZonePlaceholderProps {
  /**
   * Placeholder text to display
   */
  text: string;

  /**
   * Whether something is being dragged over
   */
  isOver: boolean;

  /**
   * Whether the dragged item is valid for this zone
   */
  isValidDrop: boolean;
}

// Upload/Drop icon
const DropIcon = () => (
  <svg
    width="800px"
    height="800px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.6602 2.84949H19.1516C20.2555 2.84949 21.1504 3.74441 21.1504 4.84836V8.33977"
      stroke="#DF1463"
      strokeWidth="1.69904"
      strokeLinecap="round"
    />
    <path
      d="M2.84961 8.33978L2.84961 4.84837C2.84961 3.74443 3.74453 2.8495 4.84848 2.8495L8.33989 2.8495"
      stroke="currentColor"
      strokeWidth="1.69904"
      strokeLinecap="round"
    />
    <path
      d="M21.1504 15.6602L21.1504 19.1516C21.1504 20.2555 20.2555 21.1504 19.1515 21.1504L15.6601 21.1504"
      stroke="currentColor"
      strokeWidth="1.69904"
      strokeLinecap="round"
    />
    <path
      d="M8.33984 21.1505L4.84843 21.1505C3.74449 21.1505 2.84956 20.2555 2.84956 19.1516L2.84956 15.6602"
      stroke="currentColor"
      strokeWidth="1.69904"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Placeholder displayed when DropZone is empty
 */
export const DropZonePlaceholder: React.FC<DropZonePlaceholderProps> = ({
  text,
  isOver,
  isValidDrop,
}) => {
  return (
    <Box
      className="mond-dropzone__placeholder"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap="sm"
      padding="8"
    >
      <Icon
        size="2xl"
        color={
          isOver && isValidDrop
            ? "var(--mond-border-primary)"
            : "var(--mond-icon-secondary)"
        }
        decorative
      >
        <DropIcon />
      </Icon>
      <Text
        size="md"
        semantic={isOver && isValidDrop ? "primary" : "secondary"}
        align="center"
      >
        {isOver && isValidDrop ? "Release to drop" : text}
      </Text>
    </Box>
  );
};

DropZonePlaceholder.displayName = "DropZonePlaceholder";
