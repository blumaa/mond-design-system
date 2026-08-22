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

  it("label heads the group and names the list", () => {
    render(
      <ListGroup label="Account">
        <ListItem title="Profile" />
      </ListGroup>,
    );
    expect(screen.getByRole("list", { name: "Account" })).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
  });

  it("without a label the list carries no stray labelledby", () => {
    render(
      <ListGroup>
        <ListItem title="Profile" />
      </ListGroup>,
    );
    expect(screen.getByRole("list")).not.toHaveAttribute("aria-labelledby");
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

  it("as renders the router's link in the row", () => {
    const Fake = (props: React.ComponentProps<"a">) => <a data-testid="fake" {...props} />;
    render(
      <ListGroup>
        <ListItem as={Fake} title="Go" href="/there" />
      </ListGroup>,
    );
    expect(screen.getByTestId("fake")).toHaveAttribute("href", "/there");
  });

  it("title and description take rich nodes", () => {
    render(
      <ListGroup>
        <ListItem
          title={<span>Ada <em>the first</em></span>}
          description={<span>joined <time dateTime="2026-08-01">Aug 1</time></span>}
        />
      </ListGroup>,
    );
    expect(screen.getByText("the first")).toBeInTheDocument();
    expect(screen.getByText("Aug 1")).toBeInTheDocument();
  });

  it("standalone item renders a div, not a listitem", () => {
    render(<ListItem title="Solo" data-testid="row" />);
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    expect(screen.getByTestId("row").tagName).toBe("DIV");
  });

  it("standalone item paints the card surface by default", () => {
    render(<ListItem title="Solo" data-testid="row" />);
    expect(screen.getByTestId("row").className).toContain("surface-card");
  });

  it("standalone item takes a surface", () => {
    render(<ListItem title="Prompt" surface="accent" data-testid="row" />);
    expect(screen.getByTestId("row").className).toContain("surface-accent");
  });

  it("grouped item paints no own surface by default — the group is the card", () => {
    render(
      <ListGroup>
        <ListItem title="Row" data-testid="row" />
      </ListGroup>,
    );
    expect(screen.getByRole("listitem")).toBeInTheDocument();
    expect(screen.getByTestId("row").className).not.toContain("surface-");
  });

  it("grouped item honors an explicit surface", () => {
    render(
      <ListGroup>
        <ListItem title="Prompt" surface="accent" data-testid="row" />
      </ListGroup>,
    );
    expect(screen.getByTestId("row").className).toContain("surface-accent");
  });

  it("standalone interactive item still works", async () => {
    const onClick = vi.fn();
    render(<ListItem title="Tap" onClick={onClick} />);
    await userEvent.click(screen.getByRole("button", { name: /Tap/ }));
    expect(onClick).toHaveBeenCalled();
  });

  // A row that toggles — a member picker — is a pressed button, and the state
  // has to live on the button a screen reader is focused on, not on the <li>
  // around it.
  it("puts aria-pressed on the row button, not the root", () => {
    render(
      <ListGroup>
        <ListItem title="Ada" onClick={() => {}} pressed data-testid="row" />
      </ListGroup>,
    );
    expect(screen.getByRole("button", { name: "Ada" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("row")).not.toHaveAttribute("aria-pressed");
  });

  it("leaves aria-pressed off entirely unless the row is a toggle", () => {
    render(<ListItem title="Tap" onClick={() => {}} />);
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-pressed");
  });

  /* A roster row goes to the member's profile and carries an add/remove
     button of its own. Put that button in the row's own hit target and it is
     a button inside a link: invalid, and unreachable by name. */
  describe("actions", () => {
    it("keeps the row's own controls outside its link", () => {
      render(<ListItem title="Ada" href="/members/ada" actions={<button type="button">Remove</button>} />);
      expect(screen.getByRole("link", { name: "Ada" })).not.toContainElement(
        screen.getByRole("button", { name: "Remove" }),
      );
    });

    it("keeps them outside the row's own button too", () => {
      render(<ListItem title="Ada" onClick={() => {}} actions={<button type="button">Remove</button>} />);
      expect(screen.getByRole("button", { name: "Ada" })).not.toContainElement(
        screen.getByRole("button", { name: "Remove" }),
      );
    });

    it("shows them beside a static row", () => {
      render(<ListItem title="Ada" actions={<button type="button">Remove</button>} />);
      expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
    });

    it("has no axe violations with a control beside a link row", async () => {
      const { container } = render(
        <ListGroup>
          <ListItem title="Ada" href="/members/ada" actions={<button type="button">Remove Ada</button>} />
        </ListGroup>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
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
