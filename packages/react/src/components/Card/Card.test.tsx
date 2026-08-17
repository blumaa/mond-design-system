// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Card, CardBody, CardFooter, CardHeader } from "./Card";

describe("Card", () => {
  it("composes header, body, footer", () => {
    render(
      <Card data-testid="c">
        <CardHeader>Title</CardHeader>
        <CardBody>Content</CardBody>
        <CardFooter>Actions</CardFooter>
      </Card>,
    );
    const card = screen.getByTestId("c");
    expect(card).toHaveTextContent("Title");
    expect(card).toHaveTextContent("Content");
    expect(card).toHaveTextContent("Actions");
  });

  it("body alone works", () => {
    render(
      <Card data-testid="c">
        <CardBody>Just content</CardBody>
      </Card>,
    );
    expect(screen.getByTestId("c")).toHaveTextContent("Just content");
  });

  it("raised variant applies class", () => {
    render(
      <Card variant="raised" data-testid="c">
        <CardBody>x</CardBody>
      </Card>,
    );
    expect(screen.getByTestId("c").className).toContain("variant-raised");
  });

  it("sunken variant applies class", () => {
    render(
      <Card variant="sunken" data-testid="c">
        <CardBody>x</CardBody>
      </Card>,
    );
    expect(screen.getByTestId("c").className).toContain("variant-sunken");
  });

  it("emphasis adds the accent class; plain cards lack it", () => {
    render(
      <div>
        <Card emphasis data-testid="marked"><CardBody>x</CardBody></Card>
        <Card data-testid="plain"><CardBody>y</CardBody></Card>
      </div>,
    );
    expect(screen.getByTestId("marked").className).toMatch(/emphasis/);
    expect(screen.getByTestId("plain").className).not.toMatch(/emphasis/);
  });

  it("interactive card: whole card is a button", async () => {
    const onClick = vi.fn();
    render(
      <Card onClick={onClick}>
        <CardBody>Tap</CardBody>
      </Card>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Tap" }));
    expect(onClick).toHaveBeenCalled();
  });

  it("href card: whole card is a link", () => {
    render(
      <Card href="/x">
        <CardBody>Go</CardBody>
      </Card>,
    );
    expect(screen.getByRole("link", { name: "Go" })).toHaveAttribute("href", "/x");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <Card>
          <CardHeader>Title</CardHeader>
          <CardBody>Static</CardBody>
        </Card>
        <Card onClick={() => {}}>
          <CardBody>Button</CardBody>
        </Card>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
