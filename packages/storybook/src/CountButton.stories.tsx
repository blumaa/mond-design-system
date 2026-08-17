import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { CountButton, Inline } from "@mond-design-system/react";

function HeartGlyph({ filled }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" width={20} height={20} aria-hidden="true">
      <path
        d="M10 17s-6.5-4.3-8.4-8C.4 6.6 1.8 3.5 4.8 3.1 6.6 2.9 8.6 3.9 10 5.8c1.4-1.9 3.4-2.9 5.2-2.7 3 .4 4.4 3.5 3.2 5.9-1.9 3.7-8.4 8-8.4 8z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CommentGlyph() {
  return (
    <svg viewBox="0 0 20 20" width={20} height={20} aria-hidden="true">
      <path
        d="M3 4.5h14v9H8l-4 3v-3H3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const meta = {
  title: "Atoms/CountButton",
  component: CountButton,
} satisfies Meta<typeof CountButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Toggle: Story = {
  args: { icon: <HeartGlyph />, label: "Like", children: "12" },
  render: function Render(args) {
    const [liked, setLiked] = useState(false);
    return (
      <CountButton
        {...args}
        icon={<HeartGlyph filled={liked} />}
        label={liked ? "Unlike" : "Like"}
        active={liked}
        onClick={() => setLiked((v) => !v)}
      >
        {liked ? 13 : 12}
      </CountButton>
    );
  },
};

export const NonToggle: Story = {
  args: { icon: <CommentGlyph />, label: "Comments", children: "8" },
};

export const Loading: Story = {
  args: { icon: <HeartGlyph />, label: "Like", loading: true, children: "12" },
};

export const Tones: Story = {
  args: { icon: <HeartGlyph filled />, label: "Like" },
  render: () => (
    <Inline gap="loose">
      <CountButton icon={<HeartGlyph filled />} label="Like" active tone="accent">
        3
      </CountButton>
      <CountButton icon={<HeartGlyph filled />} label="Like" active tone="danger">
        3
      </CountButton>
    </Inline>
  ),
};
