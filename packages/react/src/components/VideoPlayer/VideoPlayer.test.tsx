// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { VideoPlayer } from "./VideoPlayer";

const labels = {
  region: "Hip harness, slowly",
  play: "Play",
  pause: "Pause",
  mute: "Mute",
  unmute: "Unmute",
  fullscreen: "Fullscreen",
  exitFullscreen: "Leave fullscreen",
  seek: "Seek",
};

const src = "https://example.test/keiko.mp4";

function stubMedia() {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => Promise.resolve());
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  Object.defineProperty(HTMLMediaElement.prototype, "duration", { configurable: true, get: () => 754 });
}

function video(): HTMLVideoElement {
  const el = document.querySelector("video");
  if (!el) throw new Error("no video element rendered");
  return el;
}

/* The play control drawn on the picture: hidden from anyone reading the page
   aloud, because the control row already says the same thing. */
const start = (container: HTMLElement) => container.querySelector("button[aria-hidden='true']");

describe("VideoPlayer", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    stubMedia();
  });

  it("plays what it is given", () => {
    render(<VideoPlayer src={src} poster="/poster.jpg" labels={labels} />);
    expect(video()).toHaveAttribute("src", src);
    expect(video()).toHaveAttribute("poster", "/poster.jpg");
  });

  it("names itself for anyone who cannot see it", () => {
    render(<VideoPlayer src={src} labels={labels} />);
    expect(screen.getByRole("region", { name: "Hip harness, slowly" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <VideoPlayer
        src={src}
        labels={labels}
        chapters={[{ at: 0, label: "Setting up" }]}
        chaptersLabel="Chapters"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("VideoPlayer transport", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    stubMedia();
  });

  it("starts and stops", async () => {
    render(<VideoPlayer src={src} labels={labels} />);

    await userEvent.click(screen.getByRole("button", { name: "Play" }));
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();

    fireEvent.play(video());
    await userEvent.click(screen.getByRole("button", { name: "Pause" }));
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

  it("follows the element rather than its own clicks", () => {
    render(<VideoPlayer src={src} labels={labels} />);
    fireEvent.play(video());
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
    fireEvent.pause(video());
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });

  it("mutes and unmutes", async () => {
    render(<VideoPlayer src={src} labels={labels} />);

    await userEvent.click(screen.getByRole("button", { name: "Mute" }));
    expect(video().muted).toBe(true);
    await userEvent.click(screen.getByRole("button", { name: "Unmute" }));
    expect(video().muted).toBe(false);
  });
});

describe("VideoPlayer fullscreen", () => {
  const enter = vi.fn().mockResolvedValue(undefined);
  const exit = vi.fn().mockResolvedValue(undefined);

  const nowFullscreen = (element: Element | null) => {
    Object.defineProperty(document, "fullscreenElement", { configurable: true, value: element });
    act(() => {
      document.dispatchEvent(new Event("fullscreenchange"));
    });
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    stubMedia();
    enter.mockClear();
    exit.mockClear();
    Object.defineProperty(HTMLElement.prototype, "requestFullscreen", { configurable: true, value: enter });
    Object.defineProperty(document, "exitFullscreen", { configurable: true, value: exit });
    Object.defineProperty(document, "fullscreenElement", { configurable: true, value: null });
  });

  it("takes the whole player up, chrome and all", async () => {
    const { container } = render(<VideoPlayer src={src} labels={labels} />);

    await userEvent.click(screen.getByRole("button", { name: "Fullscreen" }));

    expect(enter.mock.instances[0]).toBe(container.firstElementChild);
  });

  it("offers the way out once it is in, and takes it", async () => {
    const { container } = render(<VideoPlayer src={src} labels={labels} />);

    nowFullscreen(container.firstElementChild);

    const leave = screen.getByRole("button", { name: "Leave fullscreen" });
    expect(screen.queryByRole("button", { name: "Fullscreen" })).toBeNull();

    await userEvent.click(leave);
    expect(exit).toHaveBeenCalled();
    expect(enter).not.toHaveBeenCalled();
  });

  it("goes back to offering the way in when the browser leaves without asking", () => {
    const { container } = render(<VideoPlayer src={src} labels={labels} />);

    nowFullscreen(container.firstElementChild);
    expect(screen.getByRole("button", { name: "Leave fullscreen" })).toBeInTheDocument();

    nowFullscreen(null);
    expect(screen.getByRole("button", { name: "Fullscreen" })).toBeInTheDocument();
  });
});

describe("VideoPlayer chapters", () => {
  const chapters = [
    { at: 0, label: "Setting up" },
    { at: 310, label: "The safety note" },
    { at: 620, label: "Coming down" },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    stubMedia();
  });

  it("lists them with the time each one starts", () => {
    render(<VideoPlayer src={src} labels={labels} chapters={chapters} chaptersLabel="Chapters" />);
    expect(screen.getByRole("button", { name: /The safety note/ })).toHaveTextContent("5:10");
  });

  it("moves the video and tells the caller", async () => {
    const onChapterSelect = vi.fn();
    render(
      <VideoPlayer
        src={src}
        labels={labels}
        chapters={chapters}
        chaptersLabel="Chapters"
        onChapterSelect={onChapterSelect}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: /The safety note/ }));
    expect(video().currentTime).toBe(310);
    expect(onChapterSelect).toHaveBeenCalledWith(310);
  });

  it("draws no list when there are none", () => {
    render(<VideoPlayer src={src} labels={labels} />);
    expect(screen.queryByRole("list")).toBeNull();
  });

  it("will not take chapters without a name for the list of them", () => {
    // @ts-expect-error — chapters without chaptersLabel must not compile
    const invalid = <VideoPlayer src={src} labels={labels} chapters={chapters} />;
    void invalid;
  });
});

describe("VideoPlayer captions", () => {
  const captions = { src: "/keiko.de.vtt", lang: "de", label: "Deutsch" };

  beforeEach(() => {
    vi.restoreAllMocks();
    stubMedia();
  });

  it("carries the track it is given", () => {
    const { container } = render(
      <VideoPlayer src={src} labels={labels} captions={captions} captionsLabel="Captions" />,
    );
    const track = container.querySelector("track");
    expect(track).toHaveAttribute("src", "/keiko.de.vtt");
    expect(track).toHaveAttribute("srclang", "de");
  });

  it("offers no captions button without one", () => {
    render(<VideoPlayer src={src} labels={labels} />);
    expect(screen.queryByRole("button", { name: /captions/i })).toBeNull();
  });

  it("keeps aria-pressed in step with the track as it is toggled", async () => {
    const track = { mode: "disabled" };
    Object.defineProperty(HTMLMediaElement.prototype, "textTracks", {
      configurable: true,
      get: () => [track],
    });
    try {
      render(<VideoPlayer src={src} labels={labels} captions={captions} captionsLabel="Captions" />);
      const button = screen.getByRole("button", { name: "Captions" });
      expect(button).toHaveAttribute("aria-pressed", "false");
      await userEvent.click(button);
      expect(track.mode).toBe("showing");
      expect(button).toHaveAttribute("aria-pressed", "true");
      await userEvent.click(button);
      expect(track.mode).toBe("disabled");
      expect(button).toHaveAttribute("aria-pressed", "false");
    } finally {
      delete (HTMLMediaElement.prototype as { textTracks?: unknown }).textTracks;
    }
  });
});

describe("VideoPlayer scrubber", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    stubMedia();
  });

  it("spans the whole file once its length is known", () => {
    render(<VideoPlayer src={src} labels={labels} />);
    fireEvent.loadedMetadata(video());
    expect(screen.getByRole("slider", { name: "Seek" })).toHaveAttribute("max", "754");
  });

  it("seeks the element", () => {
    render(<VideoPlayer src={src} labels={labels} />);
    fireEvent.loadedMetadata(video());
    fireEvent.change(screen.getByRole("slider", { name: "Seek" }), { target: { value: "90" } });
    expect(video().currentTime).toBe(90);
  });

  it("says where it is in words as well as by position", () => {
    render(<VideoPlayer src={src} labels={labels} />);
    fireEvent.loadedMetadata(video());
    video().currentTime = 90;
    fireEvent.timeUpdate(video());
    expect(screen.getByText("1:30 / 12:34")).toBeInTheDocument();
  });
});

describe("VideoPlayer before it plays", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    stubMedia();
  });

  it("asks for its first frame when there is no still to show instead", () => {
    render(<VideoPlayer src={src} labels={labels} />);
    fireEvent.loadedMetadata(video());
    expect(video().currentTime).toBeGreaterThan(0);
    expect(video().currentTime).toBeLessThan(1);
  });

  it("leaves a video that has a poster alone", () => {
    render(<VideoPlayer src={src} poster="/poster.jpg" labels={labels} />);
    fireEvent.loadedMetadata(video());
    expect(video().currentTime).toBe(0);
  });

  it("does not haul a video already underway back to the beginning", () => {
    render(<VideoPlayer src={src} labels={labels} />);
    video().currentTime = 90;
    fireEvent.loadedMetadata(video());
    expect(video().currentTime).toBe(90);
  });

  it("puts a play control on the picture itself", async () => {
    const { container } = render(<VideoPlayer src={src} labels={labels} />);

    const control = start(container);
    expect(control).toBeInTheDocument();
    await userEvent.click(control as HTMLElement);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
  });

  it("takes it away once the video is running", () => {
    const { container } = render(<VideoPlayer src={src} labels={labels} />);
    fireEvent.play(video());
    expect(start(container)).toBeNull();
  });

  it("tells a screen reader nothing the control row has not said", () => {
    const { container } = render(<VideoPlayer src={src} labels={labels} />);
    expect(start(container)).toHaveAttribute("tabindex", "-1");
    expect(screen.getAllByRole("button", { name: "Play" })).toHaveLength(1);
  });
});

describe("VideoPlayer covered", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    stubMedia();
  });

  it("puts the caller's cover over the picture", () => {
    render(<VideoPlayer src={src} labels={labels} covered cover={<p>Rope on skin</p>} />);
    expect(screen.getByText("Rope on skin")).toBeInTheDocument();
  });

  it("obscures what is under it", () => {
    const { container } = render(<VideoPlayer src={src} labels={labels} covered />);
    expect(container.firstElementChild?.className).toContain("covered");
  });

  it("leaves a covered video to its cover rather than inviting a tap on it", () => {
    const { container } = render(<VideoPlayer src={src} labels={labels} covered cover={<p>Rope on skin</p>} />);
    expect(start(container)).toBeNull();
  });

  it("will not autoplay something still covered", () => {
    render(<VideoPlayer src={src} labels={labels} covered autoPlay />);
    expect(video()).not.toHaveAttribute("autoplay");
  });

  it("autoplays once the cover is off", () => {
    render(<VideoPlayer src={src} labels={labels} autoPlay />);
    expect(video()).toHaveAttribute("autoplay");
  });

  it("stays still unless asked", () => {
    render(<VideoPlayer src={src} labels={labels} />);
    expect(video()).not.toHaveAttribute("autoplay");
  });
});
