import { render, screen, fireEvent } from "@testing-library/preact";
import { describe, it, expect, vi } from "vitest";
import { PageHeader } from "../../../src/components/layout/page-header.tsx";

describe("PageHeader", () => {
  it("renders title text passed as prop", () => {
    render(<PageHeader title="My Page Title" />);
    expect(
      screen.getByRole("heading", { name: "My Page Title" }),
    ).toBeInTheDocument();
  });

  it("does NOT render back button when onBack prop is not provided", () => {
    render(<PageHeader title="No Back" />);
    expect(
      screen.queryByRole("button", { name: "Go back" }),
    ).not.toBeInTheDocument();
  });

  it("renders back button when onBack prop is provided", () => {
    render(<PageHeader title="With Back" onBack={() => {}} />);
    expect(screen.getByRole("button", { name: "Go back" })).toBeInTheDocument();
  });

  it("clicking back button calls the onBack callback", () => {
    const onBack = vi.fn();
    render(<PageHeader title="Clickable Back" onBack={onBack} />);
    fireEvent.click(screen.getByRole("button", { name: "Go back" }));
    expect(onBack).toHaveBeenCalledOnce();
  });
});
