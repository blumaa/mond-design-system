// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Lightbox } from "./Lightbox";

const labels = {
  dialog: "Image",
  close: "Close",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
};

const picture = () => screen.getByRole("img");

/* The box that clips the picture is the picture's own parent: everything the
   gesture handlers listen for lands there. */
const surface = () => picture().parentElement as HTMLElement;

const zoomOf = (element: HTMLElement) => element.style.getPropertyValue("--zoom");
const panOf = (element: HTMLElement) =>
  `${element.style.getPropertyValue("--pan-x")}, ${element.style.getPropertyValue("--pan-y")}`;

const measure = (element: HTMLElement, width: number, height: number) => {
  element.getBoundingClientRect = () =>
    ({ width, height, top: 0, left: 0, right: width, bottom: height, x: 0, y: 0 }) as DOMRect;
};

const touch = (element: HTMLElement, id: number, x: number, y: number, type: "Down" | "Move" | "Up") =>
  fireEvent[`pointer${type}`](element, { pointerId: id, clientX: x, clientY: y });

describe("Lightbox", () => {
  it("is not there until it opens", () => {
    render(<Lightbox open={false} onClose={() => {}} src="/keiko.jpg" alt="A chest harness" labels={labels} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("is a modal dialog with the picture in it", () => {
    render(<Lightbox open onClose={() => {}} src="/keiko.jpg" alt="A chest harness" labels={labels} />);

    expect(screen.getByRole("dialog", { name: "Image" })).toHaveAttribute("aria-modal", "true");
    expect(picture()).toHaveAttribute("src", "/keiko.jpg");
    expect(picture()).toHaveAccessibleName("A chest harness");
  });

  it("closes on the close control and on Escape", async () => {
    const onClose = vi.fn();
    render(<Lightbox open onClose={onClose} src="/keiko.jpg" alt="" labels={labels} />);

    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);

    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("says what the picture is under it, when the picture has a caption", () => {
    render(
      <Lightbox
        open
        onClose={() => {}}
        src="/keiko.jpg"
        alt="A chest harness"
        caption="Where the load is carried"
        labels={labels}
      />,
    );
    expect(screen.getByText("Where the load is carried")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    render(
      <Lightbox
        open
        onClose={() => {}}
        src="/keiko.jpg"
        alt="A chest harness"
        caption="Where the load is carried"
        labels={labels}
      />,
    );
    expect(await axe(document.body)).toHaveNoViolations();
  });
});

describe("Lightbox zoom", () => {
  it("zooms in and back out from the controls", async () => {
    render(<Lightbox open onClose={() => {}} src="/keiko.jpg" alt="A chest harness" labels={labels} />);

    expect(zoomOf(picture())).toBe("1");

    await userEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(zoomOf(picture())).toBe("2");

    await userEvent.click(screen.getByRole("button", { name: "Zoom out" }));
    expect(zoomOf(picture())).toBe("1");
  });

  it("stops at both ends rather than zooming for ever", async () => {
    render(<Lightbox open onClose={() => {}} src="/keiko.jpg" alt="A chest harness" labels={labels} />);

    const inwards = screen.getByRole("button", { name: "Zoom in" });
    for (let press = 0; press < 6; press += 1) await userEvent.click(inwards);
    expect(zoomOf(picture())).toBe("4");
    expect(inwards).toBeDisabled();

    const outwards = screen.getByRole("button", { name: "Zoom out" });
    for (let press = 0; press < 6; press += 1) await userEvent.click(outwards);
    expect(zoomOf(picture())).toBe("1");
    expect(outwards).toBeDisabled();
  });

  it("goes in and out again on a double tap", async () => {
    render(<Lightbox open onClose={() => {}} src="/keiko.jpg" alt="A chest harness" labels={labels} />);

    await userEvent.dblClick(surface());
    expect(zoomOf(picture())).toBe("2.5");

    await userEvent.dblClick(surface());
    expect(zoomOf(picture())).toBe("1");
  });

  it("takes the scale from the distance between two fingers", () => {
    render(<Lightbox open onClose={() => {}} src="/keiko.jpg" alt="A chest harness" labels={labels} />);

    touch(surface(), 1, 0, 0, "Down");
    touch(surface(), 2, 100, 0, "Down");
    touch(surface(), 2, 300, 0, "Move");
    expect(zoomOf(picture())).toBe("3");

    touch(surface(), 2, 150, 0, "Move");
    expect(zoomOf(picture())).toBe("1.5");
  });

  it("takes the same gesture from a trackpad, which arrives as a wheel", () => {
    render(<Lightbox open onClose={() => {}} src="/keiko.jpg" alt="A chest harness" labels={labels} />);

    fireEvent.wheel(surface(), { deltaY: -100, ctrlKey: true });
    expect(zoomOf(picture())).toBe("2.718");

    fireEvent.wheel(surface(), { deltaY: 100, ctrlKey: true });
    expect(zoomOf(picture())).toBe("1");
  });

  it("leaves an ordinary wheel alone — that one is not a zoom", () => {
    render(<Lightbox open onClose={() => {}} src="/keiko.jpg" alt="A chest harness" labels={labels} />);

    fireEvent.wheel(surface(), { deltaY: -100 });
    expect(zoomOf(picture())).toBe("1");
  });

  it("takes the browser's own zoom out of the gesture", () => {
    render(<Lightbox open onClose={() => {}} src="/keiko.jpg" alt="A chest harness" labels={labels} />);

    const pinch = new WheelEvent("wheel", { deltaY: -100, ctrlKey: true, bubbles: true, cancelable: true });
    fireEvent(surface(), pinch);

    expect(pinch.defaultPrevented).toBe(true);
  });

  it("opens the next picture where the last one started", async () => {
    const { rerender } = render(
      <Lightbox open onClose={() => {}} src="/keiko.jpg" alt="A chest harness" labels={labels} />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(zoomOf(picture())).toBe("2");

    rerender(<Lightbox open onClose={() => {}} src="/marta.jpg" alt="A hip harness" labels={labels} />);
    expect(zoomOf(picture())).toBe("1");
  });
});

describe("Lightbox pan", () => {
  it("pans with one finger once there is more picture than frame", () => {
    render(<Lightbox open onClose={() => {}} src="/keiko.jpg" alt="A chest harness" labels={labels} />);
    measure(surface(), 400, 400);

    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));

    touch(surface(), 1, 200, 200, "Down");
    touch(surface(), 1, 260, 200, "Move");

    expect(panOf(picture())).toBe("60px, 0px");
  });

  it("does not pan a picture that is not zoomed — there is nothing off the edge", () => {
    render(<Lightbox open onClose={() => {}} src="/keiko.jpg" alt="A chest harness" labels={labels} />);
    measure(surface(), 400, 400);

    touch(surface(), 1, 200, 200, "Down");
    touch(surface(), 1, 260, 260, "Move");

    expect(panOf(picture())).toBe("0px, 0px");
  });

  it("holds the picture inside its own edges", () => {
    render(<Lightbox open onClose={() => {}} src="/keiko.jpg" alt="A chest harness" labels={labels} />);
    measure(surface(), 400, 400);

    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));

    touch(surface(), 1, 200, 200, "Down");
    touch(surface(), 1, 900, 200, "Move");

    expect(panOf(picture())).toBe("200px, 0px");
  });
});
