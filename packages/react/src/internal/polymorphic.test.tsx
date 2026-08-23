// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { Container } from "../components/Container/Container";
import { Inline } from "../components/Inline/Inline";
import { Stack } from "../components/Stack/Stack";

/* One suite for the three, because the promise is the same one: what `as`
   names, the props follow. A test per primitive would drift the day a fourth
   is added and only two of them are checked. */
describe("what `as` promises", () => {
  it("takes a form's own attributes when it is a form", () => {
    render(
      <Stack as="form" autoComplete="off" noValidate data-testid="s">
        x
      </Stack>,
    );
    const form = screen.getByTestId("s") as HTMLFormElement;
    expect(form.tagName).toBe("FORM");
    expect(form).toHaveAttribute("autocomplete", "off");
    expect(form.noValidate).toBe(true);
  });

  it("takes a list's own attributes when it is a list", () => {
    render(
      <Inline as="ol" start={3} data-testid="i">
        <li>x</li>
      </Inline>,
    );
    expect(screen.getByTestId("i")).toHaveAttribute("start", "3");
  });

  it("hands back the element it rendered", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Container as="section" ref={ref}>
        x
      </Container>,
    );
    expect(ref.current?.tagName).toBe("SECTION");
  });

  it("hands back the default element too, which is the commoner case", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Stack ref={ref}>x</Stack>);
    expect(ref.current?.tagName).toBe("DIV");
  });
});
