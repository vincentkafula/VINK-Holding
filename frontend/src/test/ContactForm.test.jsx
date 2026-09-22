import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ContactForm from "../components/ContactForm.jsx";

describe("ContactForm", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("shows a validation-relevant required attribute on name/email/message", () => {
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/Full Name/i)).toBeRequired();
    expect(screen.getByLabelText(/Email/i)).toBeRequired();
    expect(screen.getByLabelText(/Message/i)).toBeRequired();
  });

  it("prefills the subject dropdown from a ?subject= query param", () => {
    render(
      <MemoryRouter initialEntries={["/contact?subject=Investor+Enquiry"]}>
        <ContactForm />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/Subject/i)).toHaveValue("Investor Enquiry");
  });

  it("submits the form and shows the server's success message", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Thank you for contacting VINK Group.", reference: "VH-00042" }),
    });

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/Full Name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/Email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/Message/i), "Hello there");
    await user.click(screen.getByRole("button", { name: /Send Message/i }));

    await waitFor(() => {
      expect(screen.getByText(/Thank you for contacting VINK Group/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/VH-00042/)).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("shows the server's error message when the submission fails", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Too many submissions. Please try again shortly." }),
    });

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/Full Name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/Email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/Message/i), "Hello there");
    await user.click(screen.getByRole("button", { name: /Send Message/i }));

    await waitFor(() => {
      expect(screen.getByText(/Too many submissions/i)).toBeInTheDocument();
    });
  });
});
