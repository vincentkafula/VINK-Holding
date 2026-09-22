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

  it("shows the login screen when no session token is stored", () => {
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Log In/i })).toBeInTheDocument();
  });

  it("logging in stores the returned session token and loads data", async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: "real-session-jwt", expiresAt: "2026-01-01T00:00:00Z" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, name: "Jane", email: "jane@example.com", message: "Hi", submittedAt: "2026-01-01T00:00:00Z" }],
      });

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/Password/i), "correct-password");
    await user.click(screen.getByRole("button", { name: /Log In/i }));

    await waitFor(() => {
      expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    });

    expect(sessionStorage.getItem("vink_admin_token")).toBe("real-session-jwt");
    const [loginUrl, loginOptions] = global.fetch.mock.calls[0];
    expect(loginUrl).toMatch(/\/admin\/login$/);
    expect(JSON.parse(loginOptions.body)).toEqual({ username: "admin", password: "correct-password" });

    const [, dataOptions] = global.fetch.mock.calls[1];
    expect(dataOptions.headers.Authorization).toBe("Bearer real-session-jwt");
  });

  it("shows the server's error on a failed login without storing a token", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Invalid username or password." }),
    });

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/Password/i), "wrong-password");
    await user.click(screen.getByRole("button", { name: /Log In/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid username or password/i)).toBeInTheDocument();
    });
    expect(sessionStorage.getItem("vink_admin_token")).toBeNull();
  });

  it("an expired/rejected session clears the token and returns to login with an explanation", async () => {
    sessionStorage.setItem("vink_admin_token", "stale-jwt");
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Session expired. Please log in again." }),
    });

    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/session expired/i)).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(sessionStorage.getItem("vink_admin_token")).toBeNull();
  });

  it("switching tabs fetches that tab's data", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ count: 1, subscribers: [{ email: "sub@example.com", subscribedAt: "2026-01-01T00:00:00Z" }] }),
    });
    sessionStorage.setItem("vink_admin_token", "real-session-jwt");

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

  it("Lock clears the stored session and returns to the login screen", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [] });
    sessionStorage.setItem("vink_admin_token", "real-session-jwt");

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByRole("button", { name: /Lock/i })).toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: /Lock/i }));

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(sessionStorage.getItem("vink_admin_token")).toBeNull();
  });
});
