// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Radio } from "./Radio";

describe("Radio", () => {
  it("radios sharing a name are exclusive", async () => {
    render(
      <div>
        <Radio name="g" value="a" label="Alpha" />
        <Radio name="g" value="b" label="Beta" />
      </div>,
    );
    await userEvent.click(screen.getByRole("radio", { name: "Alpha" }));
    await userEvent.click(screen.getByRole("radio", { name: "Beta" }));
    expect(screen.getByRole("radio", { name: "Alpha" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "Beta" })).toBeChecked();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <fieldset>
        <legend>Group</legend>
        <Radio name="g" value="a" label="Alpha" />
        <Radio name="g" value="b" label="Beta" />
      </fieldset>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
