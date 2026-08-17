// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { IconButton } from "../IconButton/IconButton";
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
        leading={<IconButton label="Back">b</IconButton>}
        trailing={<IconButton label="Search">s</IconButton>}
      />,
    );
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<AppBar title="Sessions" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
