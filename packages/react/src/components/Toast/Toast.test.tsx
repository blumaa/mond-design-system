// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
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
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "fire" }));
    expect(screen.getByRole("region", { name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
  });

  it("dismiss button removes the toast", () => {
    render(
      <ToastProvider>
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
      <ToastProvider>
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
      <ToastProvider>
        <Trigger duration={0} />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "fire" }));
    act(() => {
      vi.advanceTimersByTime(60000);
    });
    expect(screen.getByRole("status")).toBeInTheDocument();
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
      <ToastProvider>
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

  it("useToast outside provider throws", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Trigger />)).toThrow(/ToastProvider/);
    spy.mockRestore();
  });
});
