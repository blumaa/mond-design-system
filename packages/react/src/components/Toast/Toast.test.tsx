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
    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
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

  it("useToast outside provider throws", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Trigger />)).toThrow(/ToastProvider/);
    spy.mockRestore();
  });
});
