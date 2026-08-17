// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { SearchField } from "./SearchField";

describe("SearchField", () => {
  it("renders a searchbox and reports typed text", async () => {
    const onChange = vi.fn();
    render(<SearchField label="Search sessions" value="" onChange={onChange} />);
    await userEvent.type(screen.getByRole("searchbox", { name: "Search sessions" }), "a");
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("no clear button while empty", () => {
    render(<SearchField label="Search" value="" onChange={() => {}} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("clear button empties the value", async () => {
    const onChange = vi.fn();
    render(<SearchField label="Search" value="rope" onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("has no axe violations", async () => {
    const { container } = render(<SearchField label="Search" value="x" onChange={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
