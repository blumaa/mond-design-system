// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { MediaPlaceholder } from "./MediaPlaceholder";

describe("MediaPlaceholder", () => {
  it("passes the aspect ratio to the stylesheet as a custom property", () => {
    const { container } = render(<MediaPlaceholder aspect="4 / 5" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue("--media-aspect")).toBe("4 / 5");
  });

  it("leaves the ratio to the stylesheet when the caller names none", () => {
    const { container } = render(<MediaPlaceholder />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue("--media-aspect")).toBe("");
  });

  it("blurs only when asked", () => {
    const { container, rerender } = render(<MediaPlaceholder />);
    expect(container.firstElementChild?.className).not.toContain("blurred");
    rerender(<MediaPlaceholder blurred />);
    expect(container.firstElementChild?.className).toContain("blurred");
  });

  it("hides the empty fill from assistive tech: it stands for nothing", () => {
    const { container } = render(<MediaPlaceholder caption="11 images" />);
    expect(container.querySelector("[aria-hidden]")).toBeInTheDocument();
  });

  it("renders the caption and the glyph it is handed", () => {
    render(<MediaPlaceholder caption="11 images" glyph={<svg data-glyph="" />} />);
    expect(screen.getByText("11 images")).toBeInTheDocument();
    expect(document.querySelector("[data-glyph]")).toBeInTheDocument();
  });

  it("keeps the cover out of the fill, so a blur does not reach it", () => {
    const { container } = render(
      <MediaPlaceholder blurred cover={<button type="button">Reveal</button>} />,
    );
    const cover = screen.getByRole("button", { name: "Reveal" });
    expect(cover.closest("[aria-hidden]")).toBeNull();
    /* The blur rule names the fill and the image. Anything the cover sits
       inside of must be neither, or it blurs along with them. */
    for (let node = cover.parentElement; node && node !== container; node = node.parentElement) {
      expect(node.className).not.toMatch(/fill|image/);
    }
  });

  it("has no axe violations", async () => {
    const { container } = render(<MediaPlaceholder caption="11 images" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("MediaPlaceholder with a picture", () => {
  it("draws the image instead of the fill", () => {
    const { container } = render(<MediaPlaceholder src="/keiko.jpg" alt="A chest harness" />);
    expect(screen.getByRole("img", { name: "A chest harness" })).toHaveAttribute("src", "/keiko.jpg");
    expect(container.querySelector("[aria-hidden]")).toBeNull();
  });

  it("is decorative without an alt, rather than named after the file", () => {
    render(<MediaPlaceholder src="/keiko.jpg" />);
    expect(screen.getByRole("presentation")).toHaveAttribute("alt", "");
  });

  it("blurs the picture itself, not a fill that is no longer there", () => {
    const { container } = render(<MediaPlaceholder src="/keiko.jpg" blurred />);
    expect(container.firstElementChild?.className).toContain("blurred");
    expect(screen.getByRole("presentation")).toBeInTheDocument();
  });

  it("falls back to the fill when the picture will not load", () => {
    const { container } = render(<MediaPlaceholder src="/gone.jpg" />);
    fireEvent.error(screen.getByRole("presentation"));
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("[aria-hidden]")).toBeInTheDocument();
  });

  it("tries again when the source changes, rather than staying broken", () => {
    const { rerender } = render(<MediaPlaceholder src="/gone.jpg" />);
    fireEvent.error(screen.getByRole("presentation"));
    rerender(<MediaPlaceholder src="/keiko.jpg" alt="A chest harness" />);
    expect(screen.getByRole("img", { name: "A chest harness" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<MediaPlaceholder src="/keiko.jpg" alt="A chest harness" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
