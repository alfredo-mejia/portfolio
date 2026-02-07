import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter, useLocation, Routes, Route } from "react-router";

import Home from "../pages/Home";
import Story from "../pages/Story";
import Resume from "../pages/Resume";
import Blog from "../pages/Blog";
import Projects from "../pages/Projects";
import { PROFILE } from "../constants/profile";
import { COPY_FIELD_MSG } from "../constants/messages";
import { NAV_CARDS, NAV_CARDS_ORDERED_LIST } from "../constants/navigation";

describe("Download Resume", () => {
  it("should render the download resume button", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const downloadResumeButton = screen.getByRole("button", {
      name: PROFILE.LINKS.RESUME.ARIA_LABEL,
    });
    expect(downloadResumeButton).toBeInTheDocument();
  });
});

describe("Navigation Cards", () => {
  function LocationDisplay() {
    const location = useLocation();
    return <p data-testid="location">{location.pathname}</p>;
  }

  it("should render the navigation cards", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const nav = screen.getByRole("navigation");
    const navCards = within(nav).getAllByRole("link");
    expect(navCards).toHaveLength(4);
  });

  it("should have the correct route for each navigation card", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const nav = screen.getByRole("navigation");
    const navCardsElems = within(nav).getAllByRole("link");
    navCardsElems.forEach((cardElem, index) => {
      expect(cardElem).toHaveAttribute(
        "href",
        NAV_CARDS_ORDERED_LIST[index].HREF
      );
    });
  });

  it("should navigate to story page when clicked", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path={NAV_CARDS.STORY.HREF} element={<Story />} />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>
    );
    const nav = screen.getByRole("navigation");
    const navCard = within(nav).getByRole("link", {
      name: new RegExp(NAV_CARDS.STORY.TITLE, "i"),
    });
    await user.click(navCard);
    expect(screen.getByTestId("location")).toHaveTextContent(
      NAV_CARDS.STORY.HREF
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      NAV_CARDS.STORY.TITLE
    );
  });

  it("should navigate to resume page when clicked", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path={NAV_CARDS.RESUME.HREF} element={<Resume />} />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>
    );
    const nav = screen.getByRole("navigation");
    const navCard = within(nav).getByRole("link", {
      name: new RegExp(NAV_CARDS.RESUME.TITLE, "i"),
    });
    await user.click(navCard);
    expect(screen.getByTestId("location")).toHaveTextContent(
      NAV_CARDS.RESUME.HREF
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      NAV_CARDS.RESUME.TITLE
    );
  });

  it("should navigate to blog page when clicked", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path={NAV_CARDS.BLOG.HREF} element={<Blog />} />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>
    );
    const nav = screen.getByRole("navigation");
    const navCard = within(nav).getByRole("link", {
      name: new RegExp(NAV_CARDS.BLOG.TITLE, "i"),
    });
    await user.click(navCard);
    expect(screen.getByTestId("location")).toHaveTextContent(
      NAV_CARDS.BLOG.HREF
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      NAV_CARDS.BLOG.TITLE
    );
  });

  it("should navigate to projects page when clicked", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path={NAV_CARDS.PROJECTS.HREF} element={<Projects />} />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>
    );
    const nav = screen.getByRole("navigation");
    const navCard = within(nav).getByRole("link", {
      name: new RegExp(NAV_CARDS.PROJECTS.TITLE, "i"),
    });
    await user.click(navCard);
    expect(screen.getByTestId("location")).toHaveTextContent(
      NAV_CARDS.PROJECTS.HREF
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      NAV_CARDS.PROJECTS.TITLE
    );
  });
});

describe("Copy Email Field", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      configurable: true,
    });
  });

  afterEach(() => {
    Reflect.deleteProperty(navigator, "clipboard");
    vi.clearAllMocks();
  });

  it("should render the copy email field", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const emailField = screen.getByRole("button", { name: PROFILE.EMAIL });
    expect(emailField).toBeInTheDocument();
  });

  it("should copy the email when clicked", async () => {
    const user = userEvent.setup();

    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: writeTextMock,
      },
      configurable: true,
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const emailField = screen.getByRole("button", { name: PROFILE.EMAIL });
    await user.click(emailField);

    expect(writeTextMock).toHaveBeenCalledWith(PROFILE.EMAIL);
  });

  it("should display error message when clipboard is undefined", async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      configurable: true,
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const emailField = screen.getByRole("button", { name: PROFILE.EMAIL });
    await user.click(emailField);
    expect(
      screen.getByText(COPY_FIELD_MSG.CLIPBOARD_NOT_SUPPORTED)
    ).toBeInTheDocument();
  });

  it("should display error message when clipboard access is not allowed", async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, "clipboard", {
      get() {
        throw new Error("Not allowed to access clipboard");
      },
      configurable: true,
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const emailField = screen.getByRole("button", { name: PROFILE.EMAIL });
    await user.click(emailField);
    expect(
      screen.getByText(COPY_FIELD_MSG.CLIPBOARD_NOT_SUPPORTED)
    ).toBeInTheDocument();
  });

  it("should display error message when clipboard does not exist", async () => {
    const user = userEvent.setup();
    Reflect.deleteProperty(navigator, "clipboard");

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const emailField = screen.getByRole("button", { name: PROFILE.EMAIL });
    await user.click(emailField);
    expect(
      screen.getByText(COPY_FIELD_MSG.CLIPBOARD_NOT_SUPPORTED)
    ).toBeInTheDocument();
  });

  it("should display error message when clipboard copy fails", async () => {
    const user = userEvent.setup();

    const writeTextMock = vi
      .fn()
      .mockRejectedValue(new Error("Failed to copy"));
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      configurable: true,
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const emailField = screen.getByRole("button", { name: PROFILE.EMAIL });
    await user.click(emailField);
    expect(screen.getByText(COPY_FIELD_MSG.COPY_FAILED)).toBeInTheDocument();
  });
});

describe("Social Media Links", () => {
  it("should render the social media links", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const githubLink = screen.getByRole("link", {
      name: PROFILE.LINKS.GITHUB.ARIA_LABEL,
    });
    const linkedinLink = screen.getByRole("link", {
      name: PROFILE.LINKS.LINKEDIN.ARIA_LABEL,
    });
    expect(githubLink).toBeInTheDocument();
    expect(linkedinLink).toBeInTheDocument();
  });

  it("should target the correct social media links in new tab", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const githubLink = screen.getByRole("link", {
      name: PROFILE.LINKS.GITHUB.ARIA_LABEL,
    });
    const linkedinLink = screen.getByRole("link", {
      name: PROFILE.LINKS.LINKEDIN.ARIA_LABEL,
    });
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(linkedinLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("href", PROFILE.LINKS.GITHUB.URL);
    expect(linkedinLink).toHaveAttribute("href", PROFILE.LINKS.LINKEDIN.URL);
  });
});

// Resources
// - https://stackoverflow.com/a/72584756
