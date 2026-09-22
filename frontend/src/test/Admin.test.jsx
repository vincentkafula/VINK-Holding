import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Admin from "../pages/Admin.jsx";

describe("Admin", () => {
  beforeEach(() => {
    sessionStorage.clear();
    global.fetch = vi.fn();
  });
  afterEach(() => {
    sessionStorage.clear();
  });

  it("shows the token entry screen when no token is stored", () => {
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/Admin Token/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Unlock/i })).toBeInTheDocument();
  });

  it("submitting a token stores it and attempts to load data", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [{ id: 1, name: "Jane", email: "jane@example.com", message: "Hi", submittedAt: "2026-01-01T00:00:00Z" }],
    });

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/Admin Token/i), "correct-token");
    await user.click(screen.getByRole("button", { name: /Unlock/i }));

    await waitFor(() => {
      expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    });

    expect(sessionStorage.getItem("vink_admin_token")).toBe("correct-token");
    const [, options] = global.fetch.mock.calls[0];
    expect(options.headers.Authorization).toBe("Bearer correct-token");
  });

  it("clears the stored token and shows an explanatory error on a 401, returning to the login screen", async () => {
    sessionStorage.setItem("vink_admin_token", "bad-token");
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Unauthorized." }),
    });

    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/rejected/i)).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/Admin Token/i)).toBeInTheDocument();
    expect(sessionStorage.getItem("vink_admin_token")).toBeNull();
  });

  it("switching tabs fetches that tab's data", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ count: 1, subscribers: [{ email: "sub@example.com", subscribedAt: "2026-01-01T00:00:00Z" }] }),
    });
    sessionStorage.setItem("vink_admin_token", "correct-token");

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /Newsletter Subscribers/i }));

    await waitFor(() => {
      expect(screen.getByText("sub@example.com")).toBeInTheDocument();
    });
  });

  it("Lock clears the stored token and returns to the entry screen", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [] });
    sessionStorage.setItem("vink_admin_token", "correct-token");

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByRole("button", { name: /Lock/i })).toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: /Lock/i }));

    expect(screen.getByLabelText(/Admin Token/i)).toBeInTheDocument();
    expect(sessionStorage.getItem("vink_admin_token")).toBeNull();
  });
});
