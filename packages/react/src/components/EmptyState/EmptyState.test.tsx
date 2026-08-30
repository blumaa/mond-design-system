// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Button } from "../Button/Button";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(<EmptyState title="Nothing yet" description="Add your first item." />);
    expect(screen.getByRole("heading", { name: "Nothing yet" })).toBeInTheDocument();
    expect(screen.getByText("Add your first item.")).toBeInTheDocument();
  });

  /* The empty state can sit anywhere in a page's outline; a hardcoded h3
     under an h1 skips a level. The caller knows the outline, so the caller
     picks the level. */
  it("takes a heading level for the page's outline", () => {
    render(<EmptyState title="Nothing yet" level={2} />);
    expect(screen.getByRole("heading", { level: 2, name: "Nothing yet" })).toBeInTheDocument();
  });

  it("defaults the heading to level 3", () => {
    render(<EmptyState title="Nothing yet" />);
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
  });

  it("renders the action slot", () => {
    render(<EmptyState title="Nothing" action={<Button>Add item</Button>} />);
    expect(screen.getByRole("button", { name: "Add item" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <EmptyState title="Nothing yet" description="Add one." action={<Button>Add</Button>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
