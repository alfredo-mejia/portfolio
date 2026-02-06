import { LuBookOpenText, LuFileText, LuFilePen, LuCodeXml } from "react-icons/lu";

export const NAV_CARDS = [
    {
        ICON: <LuBookOpenText />,
        TITLE: "My Story",
        HREF: "/story",
        DESCRIPTION: "Learn more about my story and experiences."
    },
    {
        ICON: <LuFileText />,
        TITLE: "My Resume",
        HREF: "/resume",
        DESCRIPTION: "View my professional experience and skills."
    },
    {
        ICON: <LuFilePen />,
        TITLE: "My Blog",
        HREF: "/blog",
        DESCRIPTION: "Read my latest blog posts and technical articles."
    },
    {
        ICON: <LuCodeXml />,
        TITLE: "My Projects",
        HREF: "/projects",
        DESCRIPTION: "Explore my latest projects and portfolio."
    }
] as const;