import {
  LuBookOpenText,
  LuFileText,
  LuFilePen,
  LuCodeXml,
} from "react-icons/lu";

export const NAV_CARDS = {
  STORY: {
    ICON: <LuBookOpenText />,
    TITLE: "Story",
    HREF: "/story",
    DESCRIPTION: "Learn more about my story and experiences.",
    ORDER: 1,
  },
  RESUME: {
    ICON: <LuFileText />,
    TITLE: "Resume",
    HREF: "/resume",
    DESCRIPTION: "View my professional experience and skills.",
    ORDER: 2,
  },
  BLOG: {
    ICON: <LuFilePen />,
    TITLE: "Blog",
    HREF: "/blog",
    DESCRIPTION: "Read my latest blog posts and technical articles.",
    ORDER: 3,
  },
  PROJECTS: {
    ICON: <LuCodeXml />,
    TITLE: "Projects",
    HREF: "/projects",
    DESCRIPTION: "Explore my latest projects and portfolio.",
    ORDER: 4,
  },
} as const;

type NavCard = (typeof NAV_CARDS)[keyof typeof NAV_CARDS];

export const NAV_CARDS_ORDERED_LIST: readonly NavCard[] = Object.freeze(
  Object.values(NAV_CARDS).sort((a, b) => a.ORDER - b.ORDER)
);
