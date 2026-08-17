// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Button } from "../Button/Button";
import { AppBar } from "./AppBar";

describe("AppBar", () => {
  it("is a banner with a title heading", () => {
    render(<AppBar title="Sessions" />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sessions" })).toBeInTheDocument();
  });

  it("renders leading and trailing slots", () => {
    render(
      <AppBar
        title="Sessions"
        leading={<Button iconOnly aria-label="Back" variant="ghost">b</Button>}
        trailing={<Button iconOnly aria-label="Search" variant="ghost">s</Button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("subtitle renders under the title, outside the heading", () => {
    render(<AppBar title="Trip crew" subtitle="4 members" />);
    expect(screen.getByRole("heading", { name: "Trip crew" })).toBeInTheDocument();
    expect(screen.getByText("4 members")).toBeInTheDocument();
    expect(screen.getByRole("heading")).not.toHaveTextContent("4 members");
  });

  it("title takes a node", () => {
    render(<AppBar title={<button type="button">Trip crew</button>} />);
    expect(screen.getByRole("heading")).toContainElement(screen.getByRole("button", { name: "Trip crew" }));
  });

  it("has no axe violations", async () => {
    const { container } = render(<AppBar title="Sessions" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
