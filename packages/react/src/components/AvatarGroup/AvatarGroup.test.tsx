// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Avatar } from "../Avatar/Avatar";
import { AvatarGroup } from "./AvatarGroup";

const four = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Edsger Dijkstra"];

describe("AvatarGroup", () => {
  it("renders all children under max", () => {
    render(
      <AvatarGroup max={5}>
        {four.map((n) => (
          <Avatar key={n} name={n} />
        ))}
      </AvatarGroup>,
    );
    expect(screen.getAllByRole("img")).toHaveLength(4);
  });

  it("caps at max and shows +N overflow", () => {
    render(
      <AvatarGroup max={2}>
        {four.map((n) => (
          <Avatar key={n} name={n} />
        ))}
      </AvatarGroup>,
    );
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("overflow indicator announces the hidden count", () => {
    render(
      <AvatarGroup max={2}>
        {four.map((n) => (
          <Avatar key={n} name={n} />
        ))}
      </AvatarGroup>,
    );
    expect(screen.getByLabelText("2 more")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <AvatarGroup max={2}>
        {four.map((n) => (
          <Avatar key={n} name={n} />
        ))}
      </AvatarGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
