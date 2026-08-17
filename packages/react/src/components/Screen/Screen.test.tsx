// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Screen, ScreenContent } from "./Screen";

describe("Screen", () => {
  it("renders content inside a main region", () => {
    render(
      <Screen>
        <ScreenContent>Page body</ScreenContent>
      </Screen>,
    );
    expect(screen.getByRole("main")).toHaveTextContent("Page body");
  });
});
