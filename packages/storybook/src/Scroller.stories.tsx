import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardBody, Link, MediaPlaceholder, Scroller, Text } from "@mond-design-system/react";
import styles from "./story.module.css";

const meta = {
  title: "Molecules/Scroller",
  component: Scroller,
} satisfies Meta<typeof Scroller>;
export default meta;
type Story = StoryObj<typeof meta>;

const labels = { previous: "Previous", next: "Next" };

const photos: [seed: string, alt: string][] = [
  ["photo-1520975916090-3105956dac38", "Rope coiled on a wooden floor"],
  ["photo-1518709268805-4e9042af2176", "Red cord against a dark wall"],
  ["photo-1503694978374-8a2fa686963a", "A knot half tied"],
  ["photo-1517816743773-6e0fd518b4a6", "Rope over a beam"],
  ["photo-1509266272358-7701da638078", "Coils on a table"],
  ["photo-1494537176433-7a3c4ef2046f", "A length of jute"],
];

const items = photos.map(([seed, alt]) => (
  <Card key={seed} className={styles.railItem}>
    <MediaPlaceholder src={`https://images.unsplash.com/${seed}?w=400`} alt={alt} aspect="4 / 3" />
    <CardBody>
      <Text variant="label">{alt}</Text>
    </CardBody>
  </Card>
));

export const Default: Story = { args: { title: "Featured", labels, children: items } };

/** Everything already fits, so both arrows are shut. */
export const Short: Story = { args: { title: "Featured", labels, children: items.slice(0, 2) } };

/** What hangs off the title is the app's — usually the way to the rest. */
export const WithAction: Story = {
  args: {
    title: "Featured",
    labels,
    action: <Link href="#library">See all</Link>,
    children: items,
  },
};

/** The title takes the level the page's outline needs. */
export const UnderAnotherHeading: Story = {
  args: { title: "Featured", labels, level: 3, children: items },
};
