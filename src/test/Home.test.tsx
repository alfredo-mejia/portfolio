import { render, screen, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {describe, it, expect, vi, beforeEach, afterEach} from "vitest";

import Home from "../pages/Home";
import { PROFILE } from "../constants/profile";
import { COPY_FIELD_MSG } from "../constants/messages";

describe("Download Resume", () => {
    it("should render the download resume button", () => {
        render(<Home />);
        const downloadResumeButton = screen.getByRole("button", { name: PROFILE.LINKS.RESUME.ARIA_LABEL });
        expect(downloadResumeButton).toBeInTheDocument();
    });
});

describe("Navigation Cards", () => {
    it("should render the navigation cards", () => {
        render(<Home />);
        const nav = screen.getByRole("navigation")
        const navCards = within(nav).getAllByRole("link");
        expect(navCards).toHaveLength(4);
    });
});

describe("Copy Email Field", () => {
    beforeEach(() => {
        Object.defineProperty(navigator, "clipboard", {
            value: undefined,
            configurable: true
        });
    });

    afterEach(() => {
        Reflect.deleteProperty(navigator, "clipboard");
        vi.clearAllMocks();
    });

    it("should render the copy email field", () => {
        render(<Home />);
        const emailField = screen.getByRole("button", { name: PROFILE.EMAIL });
        expect(emailField).toBeInTheDocument();
    });

    it("should copy the email when clicked", async () => {
        const user = userEvent.setup();

        const writeTextMock = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(navigator, "clipboard", {
            value: {
                writeText: writeTextMock
            },
            configurable: true
        });

        render(<Home />);
        const emailField = screen.getByRole("button", { name: PROFILE.EMAIL });
        await user.click(emailField);

        expect(writeTextMock).toHaveBeenCalledWith(PROFILE.EMAIL);
    });

    it("should display error message when clipboard is undefined", async () => {
        const user = userEvent.setup();
        Object.defineProperty(navigator, "clipboard", {
            value: undefined,
            configurable: true
        });

        render(<Home />);
        const emailField = screen.getByRole("button", { name: PROFILE.EMAIL });
        await user.click(emailField);
        expect(screen.getByText(COPY_FIELD_MSG.CLIPBOARD_NOT_SUPPORTED)).toBeInTheDocument();
    });

    it("should display error message when clipboard access is not allowed", async () => {
        const user = userEvent.setup();
        Object.defineProperty(navigator, "clipboard", {
            get() {
                throw new Error("Not allowed to access clipboard");
            },
            configurable: true
        });

        render(<Home />);
        const emailField = screen.getByRole("button", { name: PROFILE.EMAIL });
        await user.click(emailField);
        expect(screen.getByText(COPY_FIELD_MSG.CLIPBOARD_NOT_SUPPORTED)).toBeInTheDocument();
    });

    it("should display error message when clipboard does not exist", async () => {
        const user = userEvent.setup();
        Reflect.deleteProperty(navigator, "clipboard");

        render(<Home />);
        const emailField = screen.getByRole("button", { name: PROFILE.EMAIL });
        await user.click(emailField);
        expect(screen.getByText(COPY_FIELD_MSG.CLIPBOARD_NOT_SUPPORTED)).toBeInTheDocument();
    });

    it("should display error message when clipboard copy fails", async () => {
        const user = userEvent.setup();

        const writeTextMock = vi.fn().mockRejectedValue(new Error("Failed to copy"));
        Object.defineProperty(navigator, "clipboard", {
            value: { writeText: writeTextMock },
            configurable: true
        });

        render(<Home />);
        const emailField = screen.getByRole("button", { name: PROFILE.EMAIL });
        await user.click(emailField);
        expect(screen.getByText(COPY_FIELD_MSG.COPY_FAILED)).toBeInTheDocument();
    });
});

describe("Social Media Links", () => {
    it("should render the social media links", () => {
        render(<Home />);
        const githubLink = screen.getByRole("link", { name: PROFILE.LINKS.GITHUB.ARIA_LABEL });
        const linkedinLink = screen.getByRole("link", { name: PROFILE.LINKS.LINKEDIN.ARIA_LABEL });
        expect(githubLink).toBeInTheDocument();
        expect(linkedinLink).toBeInTheDocument();
    });

    it("should target the correct social media links in new tab", () => {
        render(<Home />);
        const githubLink = screen.getByRole("link", { name: PROFILE.LINKS.GITHUB.ARIA_LABEL });
        const linkedinLink = screen.getByRole("link", { name: PROFILE.LINKS.LINKEDIN.ARIA_LABEL });
        expect(githubLink).toHaveAttribute("target", "_blank");
        expect(linkedinLink).toHaveAttribute("target", "_blank");
        expect(githubLink).toHaveAttribute("href", PROFILE.LINKS.GITHUB.URL)
        expect(linkedinLink).toHaveAttribute("href", PROFILE.LINKS.LINKEDIN.URL)
    });
});

// Resources
// - https://stackoverflow.com/a/72584756