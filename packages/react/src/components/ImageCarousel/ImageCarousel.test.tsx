// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { ImageCarousel } from "./ImageCarousel";
import type { CarouselSlide } from "./ImageCarousel";

const labels = {
  region: "Images",
  carouselRole: "carousel",
  slideRole: "slide",
  previous: "Previous image",
  next: "Next image",
  counter: (current: number, total: number) => `${current} of ${total}`,
  slide: (position: number) => `Image ${position}`,
  more: (hidden: number) => `${hidden} more images`,
};

const three: CarouselSlide[] = [
  { id: "a", src: "/a.jpg", alt: "First" },
  { id: "b", src: "/b.jpg", alt: "Second" },
  { id: "c", src: "/c.jpg", alt: "Third" },
];

const six: CarouselSlide[] = [...three, { id: "d" }, { id: "e" }, { id: "f" }];

const tap = (element: Element, from: number, to: number) => {
  fireEvent.pointerDown(element, { clientX: from });
  fireEvent.pointerUp(element, { clientX: to });
};

const viewport = () => screen.getByRole("group", { name: "1 of 3" });

describe("ImageCarousel", () => {
  it("announces itself as a carousel with the app's name for it", () => {
    render(<ImageCarousel slides={three} labels={labels} />);
    const region = screen.getByRole("region", { name: "Images" });
    expect(region).toHaveAttribute("aria-roledescription", "carousel");
  });

  it("shows the frame it is on, and says which one that is", () => {
    render(<ImageCarousel slides={three} labels={labels} />);
    expect(screen.getByRole("img", { name: "First" })).toBeInTheDocument();
    expect(viewport()).toHaveAttribute("aria-roledescription", "slide");
    expect(screen.getByText("1 of 3")).toBeInTheDocument();
  });

  it("renders nothing for a gallery with nothing in it", () => {
    const { container } = render(<ImageCarousel slides={[]} labels={labels} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("leaves the paging controls off a gallery of one: there is nowhere to go", () => {
    render(<ImageCarousel slides={[three[0]!]} labels={labels} />);
    expect(screen.queryByRole("button", { name: "Next image" })).toBeNull();
    expect(screen.queryByText("1 of 1")).toBeNull();
  });
});

describe("ImageCarousel paging", () => {
  it("steps forward and back on its own when nobody is holding the index", async () => {
    render(<ImageCarousel slides={three} labels={labels} defaultIndex={1} />);
    await userEvent.click(screen.getByRole("button", { name: "Next image" }));
    expect(screen.getByRole("img", { name: "Third" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Previous image" }));
    expect(screen.getByRole("img", { name: "Second" })).toBeInTheDocument();
  });

  it("obeys a held index rather than its own, and reports where it was asked to go", async () => {
    const onIndexChange = vi.fn();
    render(<ImageCarousel slides={three} labels={labels} index={0} onIndexChange={onIndexChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Next image" }));
    expect(onIndexChange).toHaveBeenCalledWith(1);
    expect(screen.getByRole("img", { name: "First" })).toBeInTheDocument();
  });

  it("takes away the step that would run off the end", () => {
    const { container } = render(<ImageCarousel slides={three} labels={labels} />);
    expect(container.querySelector("[aria-label='Previous image']")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next image" })).toBeEnabled();
    /* `visibility: hidden` takes it out of the picture and out of the
       accessible tree in one move: a control that cannot do anything is not
       worth reading out either. */
    expect(screen.queryByRole("button", { name: "Previous image" })).toBeNull();
  });

  it("pages with the arrow keys, and jumps with Home and End", () => {
    render(<ImageCarousel slides={three} labels={labels} />);
    const region = screen.getByRole("region", { name: "Images" });
    fireEvent.keyDown(region, { key: "ArrowRight" });
    expect(screen.getByRole("img", { name: "Second" })).toBeInTheDocument();
    fireEvent.keyDown(region, { key: "End" });
    expect(screen.getByRole("img", { name: "Third" })).toBeInTheDocument();
    fireEvent.keyDown(region, { key: "Home" });
    expect(screen.getByRole("img", { name: "First" })).toBeInTheDocument();
  });

  it("swipes", () => {
    render(<ImageCarousel slides={three} labels={labels} />);
    tap(viewport(), 200, 100);
    expect(screen.getByRole("img", { name: "Second" })).toBeInTheDocument();
  });

  it("reads the count out as it changes, without stealing the reader's place", () => {
    render(<ImageCarousel slides={three} labels={labels} />);
    expect(screen.getByText("1 of 3")).toHaveAttribute("aria-live", "polite");
  });
});

describe("ImageCarousel pagers", () => {
  it("shows a thumbnail per frame, up to the many it was told to", () => {
    render(<ImageCarousel slides={six} labels={labels} maxThumbnails={4} />);
    expect(screen.getAllByRole("button", { name: /^Image \d$/ })).toHaveLength(4);
    expect(screen.getByRole("button", { name: "2 more images" })).toBeInTheDocument();
    /* Three of the four thumbnails have a picture; the frame on show has one too. */
    expect(document.querySelectorAll("img")).toHaveLength(4);
  });

  it("marks the thumbnail of the frame on show, and moves on a click", async () => {
    render(<ImageCarousel slides={three} labels={labels} />);
    expect(screen.getByRole("button", { name: "Image 1" })).toHaveAttribute("aria-current", "true");
    await userEvent.click(screen.getByRole("button", { name: "Image 3" }));
    expect(screen.getByRole("img", { name: "Third" })).toBeInTheDocument();
  });

  it("sends the overflow button to the first frame no thumbnail stands for", async () => {
    render(<ImageCarousel slides={six} labels={labels} maxThumbnails={4} />);
    await userEvent.click(screen.getByRole("button", { name: "2 more images" }));
    expect(screen.getByText("5 of 6")).toBeInTheDocument();
  });

  it("offers dots instead when asked", () => {
    render(<ImageCarousel slides={three} labels={labels} pager="dots" />);
    expect(screen.getAllByRole("button", { name: /^Image \d$/ })).toHaveLength(3);
    /* A dot is a dot: only the frame on show carries a picture. */
    expect(document.querySelectorAll("img")).toHaveLength(1);
  });

  it("offers no pager at all when asked for none", () => {
    render(<ImageCarousel slides={three} labels={labels} pager="none" />);
    expect(screen.queryByRole("button", { name: "Image 1" })).toBeNull();
  });
});

describe("ImageCarousel covered frames", () => {
  const covered: CarouselSlide[] = [
    { id: "a", src: "/a.jpg", covered: true, cover: <button type="button">Show</button> },
    { id: "b", src: "/b.jpg", alt: "Second" },
  ];

  it("draws whatever the app puts over a covered frame", () => {
    render(<ImageCarousel slides={covered} labels={labels} />);
    expect(screen.getByRole("button", { name: "Show" })).toBeInTheDocument();
  });

  it("does not open a frame that is still covered", () => {
    const onZoom = vi.fn();
    render(
      <ImageCarousel
        slides={covered}
        labels={labels}
        onZoom={onZoom}
        zoomLabel="View larger"
        zoomIcon={<svg />}
      />,
    );
    expect(screen.queryByRole("button", { name: "View larger" })).toBeNull();
    tap(screen.getByRole("group", { name: "1 of 2" }), 100, 102);
    expect(onZoom).not.toHaveBeenCalled();
  });
});

describe("ImageCarousel zoom", () => {
  const zoomable = (onZoom: (index: number) => void) => (
    <ImageCarousel
      slides={three}
      labels={labels}
      defaultIndex={1}
      onZoom={onZoom}
      zoomLabel="View larger"
      zoomIcon={<svg data-zoom="" />}
    />
  );

  it("offers the control only where there is somewhere to send the frame", () => {
    render(<ImageCarousel slides={three} labels={labels} />);
    expect(screen.queryByRole("button", { name: "View larger" })).toBeNull();
  });

  it("says which frame, not merely that one was asked for", async () => {
    const onZoom = vi.fn();
    render(zoomable(onZoom));
    await userEvent.click(screen.getByRole("button", { name: "View larger" }));
    expect(onZoom).toHaveBeenCalledWith(1);
  });

  it("opens on a tap, which is what a hand does to a photograph", () => {
    const onZoom = vi.fn();
    render(zoomable(onZoom));
    tap(screen.getByRole("group", { name: "2 of 3" }), 100, 104);
    expect(onZoom).toHaveBeenCalledWith(1);
  });

  it("leaves a swipe as a swipe", () => {
    const onZoom = vi.fn();
    render(zoomable(onZoom));
    tap(screen.getByRole("group", { name: "2 of 3" }), 200, 100);
    expect(onZoom).not.toHaveBeenCalled();
    expect(screen.getByText("3 of 3")).toBeInTheDocument();
  });

  it("leaves the controls over the frame doing their own job", async () => {
    const onZoom = vi.fn();
    render(zoomable(onZoom));
    await userEvent.click(screen.getByRole("button", { name: "Next image" }));
    expect(onZoom).not.toHaveBeenCalled();
    expect(screen.getByText("3 of 3")).toBeInTheDocument();
  });
});

describe("ImageCarousel accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <ImageCarousel slides={six} labels={labels} onZoom={() => {}} zoomLabel="View larger" zoomIcon={<svg />} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
