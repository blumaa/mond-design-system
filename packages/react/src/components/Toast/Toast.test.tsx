// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { ToastProvider, useToast } from "./Toast";

function Trigger({ duration }: { duration?: number }) {
  const { toast } = useToast();
  return (
    <button type="button" onClick={() => toast({ title: "Saved", tone: "success", duration })}>
      fire
    </button>
  );
}

describe("Toast", () => {
  afterEach(() => vi.useRealTimers());

  it("toast() shows a status message in the notifications region", () => {
    render(
      <ToastProvider regionLabel="Notifications" dismissLabel="Dismiss">
        <Trigger />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "fire" }));
    expect(screen.getByRole("region", { name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
  });

  it("has no axe violations with a toast showing", async () => {
    render(
      <ToastProvider regionLabel="Notifications" dismissLabel="Dismiss">
        <Trigger duration={0} />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "fire" }));
    expect(await axe(document.body)).toHaveNoViolations();
  });

  it("dismiss button removes the toast", () => {
    render(
      <ToastProvider regionLabel="Notifications" dismissLabel="Dismiss">
        <Trigger duration={0} />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "fire" }));
    fireEvent.click(screen.getByRole("button", { name: "Dismiss: Saved" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("auto-dismisses after its duration", () => {
    vi.useFakeTimers();
    render(
      <ToastProvider regionLabel="Notifications" dismissLabel="Dismiss">
        <Trigger duration={3000} />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "fire" }));
    expect(screen.getByRole("status")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(3100);
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("duration 0 never auto-dismisses", () => {
    vi.useFakeTimers();
    render(
      <ToastProvider regionLabel="Notifications" dismissLabel="Dismiss">
        <Trigger duration={0} />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "fire" }));
    act(() => {
      vi.advanceTimersByTime(60000);
    });
    expect(screen.getByRole("status")).toBeInTheDocument();
  });


  /* WCAG 2.2.1 (Timing Adjustable): a message that leaves on its own clock
     must wait while the reader is engaging with it. Pointer over the region
     or focus inside it holds every clock; leaving lets them run on with the
     time they had left. */
  it("pauses auto-dismiss while the pointer is over the region", () => {
    vi.useFakeTimers();
    render(
      <ToastProvider regionLabel="Notifications" dismissLabel="Dismiss">
        <Trigger duration={3000} />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "fire" }));
    const region = screen.getByRole("region", { name: "Notifications" });
    fireEvent.pointerEnter(region);
    act(() => void vi.advanceTimersByTime(60000));
    expect(screen.getByRole("status")).toBeInTheDocument();
    fireEvent.pointerLeave(region);
    act(() => void vi.advanceTimersByTime(3100));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("pauses auto-dismiss while focus is inside the region", () => {
    vi.useFakeTimers();
    render(
      <ToastProvider regionLabel="Notifications" dismissLabel="Dismiss">
        <Trigger duration={3000} />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "fire" }));
    screen.getByRole("button", { name: "Dismiss: Saved" }).focus();
    act(() => void vi.advanceTimersByTime(60000));
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  /* Dismissing from the keyboard must not drop focus on <body> — the next
     Tab would start over from the top of the page. The neighbouring toast
     inherits it; the last toast has no neighbour to give it to. */
  it("moves focus to the next toast when the focused one is dismissed", () => {
    function TwoToasts() {
      const { toast } = useToast();
      return (
        <button
          type="button"
          onClick={() => {
            toast({ title: "Saved", duration: 0 });
            toast({ title: "Deleted", duration: 0 });
          }}
        >
          fire
        </button>
      );
    }
    render(
      <ToastProvider regionLabel="Notifications" dismissLabel="Dismiss">
        <TwoToasts />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "fire" }));
    const first = screen.getByRole("button", { name: "Dismiss: Saved" });
    first.focus();
    fireEvent.click(first);
    expect(screen.getByRole("button", { name: "Dismiss: Deleted" })).toHaveFocus();
  });

  it("names each dismiss button after its toast, so two toasts are distinguishable", () => {
    function TwoToasts() {
      const { toast } = useToast();
      return (
        <button
          type="button"
          onClick={() => {
            toast({ title: "Saved", duration: 0 });
            toast({ title: "Deleted", duration: 0 });
          }}
        >
          fire
        </button>
      );
    }
    render(
      <ToastProvider regionLabel="Notifications" dismissLabel="Dismiss">
        <TwoToasts />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "fire" }));
    expect(screen.getByRole("button", { name: "Dismiss: Saved" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dismiss: Deleted" })).toBeInTheDocument();
  });

  it("regionLabel and dismissLabel localise the built-in strings", () => {
    render(
      <ToastProvider regionLabel="Benachrichtigungen" dismissLabel="Schließen">
        <Trigger duration={0} />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "fire" }));
    expect(screen.getByRole("region", { name: "Benachrichtigungen" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Schließen: Saved" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  /* A refusal is not news to be read at leisure: the thing the reader asked
     for did not happen, and they are about to act as though it did. Assertive
     is for that, and for nothing calmer. */
  describe("tone", () => {
    function Tell({ tone }: { tone: "neutral" | "success" | "danger" }) {
      const { toast } = useToast();
      return (
        <button type="button" onClick={() => toast({ title: "Nothing saved", tone, duration: 0 })}>
          fire
        </button>
      );
    }

    const fire = (tone: "neutral" | "success" | "danger") => {
      render(
        <ToastProvider regionLabel="Notifications" dismissLabel="Dismiss">
          <Tell tone={tone} />
        </ToastProvider>,
      );
      fireEvent.click(screen.getByRole("button", { name: "fire" }));
    };

    it("announces a danger toast assertively", () => {
      fire("danger");
      expect(screen.getByRole("alert")).toHaveTextContent("Nothing saved");
    });

    it("leaves a neutral toast polite", () => {
      fire("neutral");
      expect(screen.getByRole("status")).toHaveTextContent("Nothing saved");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("leaves a success toast polite", () => {
      fire("success");
      expect(screen.getByRole("status")).toHaveTextContent("Nothing saved");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("dismisses a danger toast like any other", () => {
      fire("danger");
      fireEvent.click(screen.getByRole("button", { name: "Dismiss: Nothing saved" }));
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  /* A message that asks for something — "Update ready", "Install this" — needs
     the doing next to the saying. Anywhere else and the reader has to find it. */
  describe("action", () => {
    function Offer({ onTake }: { onTake: () => void }) {
      const { toast } = useToast();
      return (
        <button
          type="button"
          onClick={() =>
            toast({ title: "Update ready", duration: 0, action: { label: "Reload", onClick: onTake } })
          }
        >
          fire
        </button>
      );
    }

    it("shows the action the caller named and calls it", () => {
      const onTake = vi.fn();
      render(
        <ToastProvider regionLabel="Notifications" dismissLabel="Dismiss">
          <Offer onTake={onTake} />
        </ToastProvider>,
      );
      fireEvent.click(screen.getByRole("button", { name: "fire" }));
      fireEvent.click(screen.getByRole("button", { name: "Reload" }));
      expect(onTake).toHaveBeenCalledOnce();
    });

    it("closes once the action is taken — the message has been answered", () => {
      render(
        <ToastProvider regionLabel="Notifications" dismissLabel="Dismiss">
          <Offer onTake={() => {}} />
        </ToastProvider>,
      );
      fireEvent.click(screen.getByRole("button", { name: "fire" }));
      fireEvent.click(screen.getByRole("button", { name: "Reload" }));
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("shows no action button when the caller named none", () => {
      render(
        <ToastProvider regionLabel="Notifications" dismissLabel="Dismiss">
          <Trigger duration={0} />
        </ToastProvider>,
      );
      fireEvent.click(screen.getByRole("button", { name: "fire" }));
      expect(screen.getAllByRole("button")).toHaveLength(2); // fire + dismiss
    });
  });

  /* A nudge that has been turned down must remember it, and "not now" is the
     close button, the timeout and the action alike — every way out is an
     answer. One callback for all three is what keeps the caller from having
     to distinguish them. */
  describe("onDismiss", () => {
    function Nudge({ onGone, duration }: { onGone: () => void; duration?: number | undefined }) {
      const { toast } = useToast();
      return (
        <button
          type="button"
          onClick={() => toast({ title: "Install", duration, onDismiss: onGone })}
        >
          fire
        </button>
      );
    }

    const fire = (onGone: () => void, duration?: number) => {
      render(
        <ToastProvider regionLabel="Notifications" dismissLabel="Dismiss">
          <Nudge onGone={onGone} duration={duration} />
        </ToastProvider>,
      );
      fireEvent.click(screen.getByRole("button", { name: "fire" }));
    };

    it("fires when the toast is closed by hand", () => {
      const onGone = vi.fn();
      fire(onGone, 0);
      fireEvent.click(screen.getByRole("button", { name: "Dismiss: Install" }));
      expect(onGone).toHaveBeenCalledOnce();
    });

    it("fires when the toast times out", () => {
      vi.useFakeTimers();
      const onGone = vi.fn();
      fire(onGone, 1000);
      act(() => void vi.advanceTimersByTime(1000));
      expect(onGone).toHaveBeenCalledOnce();
    });

    it("fires once, not once per way out", () => {
      vi.useFakeTimers();
      const onGone = vi.fn();
      fire(onGone, 1000);
      fireEvent.click(screen.getByRole("button", { name: "Dismiss: Install" }));
      act(() => void vi.advanceTimersByTime(2000));
      expect(onGone).toHaveBeenCalledOnce();
    });
  });

  it("useToast outside provider throws", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Trigger />)).toThrow(/ToastProvider/);
    spy.mockRestore();
  });
});
