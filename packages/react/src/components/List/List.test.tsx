// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { ListGroup, ListItem } from "./List";

describe("List", () => {
  it("renders a list of items", () => {
    render(
      <ListGroup>
        <ListItem title="First" />
        <ListItem title="Second" />
      </ListGroup>,
    );
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("description renders under the title", () => {
    render(
      <ListGroup>
        <ListItem title="First" description="Detail" />
      </ListGroup>,
    );
    expect(screen.getByText("Detail")).toBeInTheDocument();
  });

  it("onClick makes the item a button", async () => {
    const onClick = vi.fn();
    render(
      <ListGroup>
        <ListItem title="Tap me" onClick={onClick} />
      </ListGroup>,
    );
    await userEvent.click(screen.getByRole("button", { name: /Tap me/ }));
    expect(onClick).toHaveBeenCalled();
  });

  it("href makes the item a link", () => {
    render(
      <ListGroup>
        <ListItem title="Go" href="/there" />
      </ListGroup>,
    );
    expect(screen.getByRole("link", { name: /Go/ })).toHaveAttribute("href", "/there");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ListGroup>
        <ListItem title="Static" description="Detail" />
        <ListItem title="Button" onClick={() => {}} />
        <ListItem title="Link" href="/x" />
      </ListGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
