// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { UploadProgress } from "./UploadProgress";

const labels = {
  uploading: "Uploading",
  processing: "Processing",
  done: "Uploaded",
  error: "Upload failed",
  cancel: "Cancel upload",
  retry: "Try again",
  remove: "Remove",
};

describe("UploadProgress", () => {
  it("names the file and its bar together: one row among several says which", () => {
    render(<UploadProgress name="knot.jpg" labels={labels} value={40} />);
    expect(screen.getByText("knot.jpg")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-label", "Uploading knot.jpg");
  });

  it("counts up while uploading", () => {
    render(<UploadProgress name="knot.jpg" labels={labels} value={40} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "40");
  });

  it("stops counting while processing: the server does not report a percentage", () => {
    render(<UploadProgress name="knot.jpg" labels={labels} status="processing" value={40} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar).toHaveAttribute("aria-label", "Processing knot.jpg");
  });

  it("reads the detail instead of the percentage", () => {
    render(<UploadProgress name="knot.jpg" labels={labels} value={40} detail="2.1 MB of 5 MB" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "2.1 MB of 5 MB");
  });

  it("drops the bar once there is nothing left to wait for", () => {
    render(<UploadProgress name="knot.jpg" labels={labels} status="done" />);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.getByText("Uploaded")).toBeInTheDocument();
  });

  it("cancels while running, and only then", async () => {
    const onCancel = vi.fn();
    const { rerender } = render(
      <UploadProgress name="knot.jpg" labels={labels} value={40} onCancel={onCancel} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Cancel upload" }));
    expect(onCancel).toHaveBeenCalledOnce();
    rerender(<UploadProgress name="knot.jpg" labels={labels} status="done" onCancel={onCancel} />);
    expect(screen.queryByRole("button", { name: "Cancel upload" })).not.toBeInTheDocument();
  });

  it("removes once it has stopped, and not while it is running", async () => {
    const onRemove = vi.fn();
    const { rerender } = render(
      <UploadProgress name="knot.jpg" labels={labels} value={40} onRemove={onRemove} />,
    );
    expect(screen.queryByRole("button", { name: "Remove" })).not.toBeInTheDocument();
    rerender(<UploadProgress name="knot.jpg" labels={labels} status="done" onRemove={onRemove} />);
    await userEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it("offers a retry on failure and says what went wrong, out loud", async () => {
    const onRetry = vi.fn();
    render(
      <UploadProgress
        name="knot.jpg"
        labels={labels}
        status="error"
        error="The file is larger than 20 MB."
        onRetry={onRetry}
      />,
    );
    const said = screen.getByRole("alert");
    expect(said).toHaveTextContent("The file is larger than 20 MB.");
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("falls back to the general failure when the cause is not known", () => {
    render(<UploadProgress name="knot.jpg" labels={labels} status="error" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Upload failed");
  });

  it("shows the preview and the status mark it is handed", () => {
    render(
      <UploadProgress
        name="knot.jpg"
        labels={labels}
        status="done"
        preview={<img src="/knot.jpg" alt="" />}
        mark={<svg data-mark="" />}
      />,
    );
    expect(document.querySelector("[data-mark]")).toBeInTheDocument();
    expect(document.querySelector("img")).toHaveAttribute("src", "/knot.jpg");
  });

  it("carries the status in a class, so the mark can be tinted by it", () => {
    const { container } = render(<UploadProgress name="knot.jpg" labels={labels} status="error" />);
    expect(container.firstElementChild?.className).toContain("status-error");
  });

  it("has no axe violations, running or failed", async () => {
    const running = render(
      <UploadProgress name="knot.jpg" labels={labels} value={40} detail="2.1 MB of 5 MB" onCancel={() => {}} />,
    );
    expect(await axe(running.container)).toHaveNoViolations();
    const failed = render(
      <UploadProgress name="knot.jpg" labels={labels} status="error" onRetry={() => {}} onRemove={() => {}} />,
    );
    expect(await axe(failed.container)).toHaveNoViolations();
  });
});
