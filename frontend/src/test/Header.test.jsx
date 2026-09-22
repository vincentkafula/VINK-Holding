import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../components/Header.jsx";

describe("Header", () => {
  it("renders every primary nav link pointing at a real route", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const expectedLinks = [
      ["Home", "/"],
      ["About Us", "/about"],
      ["Our Businesses", "/businesses"],
      ["Investors", "/investors"],
      ["Sustainability", "/sustainability"],
      ["Careers", "/careers"],
      ["News", "/news"],
    ];

    for (const [label, href] of expectedLinks) {
      const link = screen.getAllByRole("link", { name: label })[0];
      expect(link).toHaveAttribute("href", href);
    }
  });

  it("the Contact Us button links to the contact page", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const contactLinks = screen.getAllByRole("link", { name: "Contact Us" });
    expect(contactLinks[0]).toHaveAttribute("href", "/contact");
  });
});
