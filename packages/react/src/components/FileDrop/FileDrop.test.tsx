// @vitest-environment jsdom
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { FileDrop } from "./FileDrop";

const photo = (name = "knot.jpg") => new File(["x"], name, { type: "image/jpeg" });

describe("FileDrop", () => {
  it("asks in the app's words, and says the rule under them", () => {
    render(<FileDrop label="Drop photos here" hint="JPG or PNG, up to 20 MB" onFiles={() => {}} />);
    expect(screen.getByRole("button", { name: /Drop photos here/ })).toBeInTheDocument();
    expect(screen.getByText("JPG or PNG, up to 20 MB")).toBeInTheDocument();
  });

  it("keeps the icon out of the accessible name — the label carries the words", () => {
    render(<FileDrop label="Drop photos here" icon={<svg data-glyph="" />} onFiles={() => {}} />);
    expect(document.querySelector("[data-glyph]")?.closest("[aria-hidden]")).toBeInTheDocument();
  });

  it("opens the picker when pressed: the file input never shows itself", async () => {
    const click = vi.spyOn(HTMLInputElement.prototype, "click").mockImplementation(() => {});
    render(<FileDrop label="Drop photos here" onFiles={() => {}} />);
    await userEvent.click(screen.getByRole("button"));
    expect(click).toHaveBeenCalled();
    click.mockRestore();
  });

  it("hands over what was chosen", () => {
    const onFiles = vi.fn();
    const { container } = render(<FileDrop label="Drop photos here" multiple onFiles={onFiles} />);
    const input = container.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [photo("one.jpg"), photo("two.jpg")] } });
    expect(onFiles).toHaveBeenCalledWith([expect.any(File), expect.any(File)]);
  });

  it("clears the input after, so the same file can be chosen twice", () => {
    const { container } = render(<FileDrop label="Drop photos here" onFiles={() => {}} />);
    const input = container.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [photo()] } });
    expect(input.value).toBe("");
  });

  it("hands over what was dropped on it", () => {
    const onFiles = vi.fn();
    const { container } = render(<FileDrop label="Drop photos here" onFiles={onFiles} />);
    fireEvent.drop(container.firstElementChild as Element, { dataTransfer: { files: [photo()] } });
    expect(onFiles).toHaveBeenCalledWith([expect.any(File)]);
  });

  it("takes one file when it was told to take one, however many arrive", () => {
    const onFiles = vi.fn();
    const { container } = render(<FileDrop label="Drop a video here" onFiles={onFiles} />);
    fireEvent.drop(container.firstElementChild as Element, {
      dataTransfer: { files: [photo("one.jpg"), photo("two.jpg")] },
    });
    expect(onFiles).toHaveBeenCalledWith([expect.any(File)]);
    expect(onFiles.mock.calls[0]?.[0]).toHaveLength(1);
  });

  it("says which kinds it takes, so the picker offers those", () => {
    const { container } = render(<FileDrop label="Drop photos here" accept="image/*" multiple onFiles={() => {}} />);
    const input = container.querySelector("input[type=file]") as HTMLInputElement;
    expect(input).toHaveAttribute("accept", "image/*");
    expect(input).toHaveAttribute("multiple");
  });

  it("marks itself while a file is over it, and stops when it leaves", () => {
    const { container } = render(<FileDrop label="Drop photos here" onFiles={() => {}} />);
    const root = container.firstElementChild as Element;
    fireEvent.dragOver(root);
    expect(root.className).toContain("over");
    fireEvent.dragLeave(root);
    expect(root.className).not.toContain("over");
  });

  it("takes nothing while disabled, dropped or pressed", () => {
    const onFiles = vi.fn();
    const { container } = render(<FileDrop label="Drop photos here" disabled onFiles={onFiles} />);
    const root = container.firstElementChild as Element;
    fireEvent.dragOver(root);
    expect(root.className).not.toContain("over");
    fireEvent.drop(root, { dataTransfer: { files: [photo()] } });
    expect(onFiles).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("spreads the rest onto its root and takes a ref to it", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <FileDrop label="Drop photos here" onFiles={() => {}} ref={ref} data-testid="drop" className="mine" />,
    );
    expect(ref.current).toBe(container.firstElementChild);
    expect(ref.current).toHaveAttribute("data-testid", "drop");
    expect(ref.current?.className).toContain("mine");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <FileDrop label="Drop photos here" hint="JPG or PNG, up to 20 MB" onFiles={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
