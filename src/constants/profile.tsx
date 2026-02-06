import { LuDownload, LuGithub, LuLinkedin } from "react-icons/lu";

export const PROFILE = {
    NAME: "Alfredo Mejia",
    TAGLINE: "Software Engineer",
    EMAIL: "hello@alfredomejia.dev",
    LINKS: {
        RESUME: {
          ICON: <LuDownload />,
          URL: "",
          ARIA_LABEL: "Download Resume"
        },
        GITHUB: {
          ICON: <LuGithub />,
          URL: "https://github.com/alfredo-mejia",
          ARIA_LABEL: "Go to Github profile"
        },
        LINKEDIN: {
          ICON: <LuLinkedin />,
          URL: "https://www.linkedin.com/in/alfredo-mejia/",
          ARIA_LABEL: "Go to LinkedIn profile"
        }
    },
} as const;