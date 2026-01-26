import { LuDownload, LuBookOpenText, LuFileText, LuFilePen, LuCodeXml, LuGithub, LuLinkedin } from "react-icons/lu";

import Button from "../components/Button.tsx";
import NavCard from "../components/NavCard.tsx";
import CopyFieldButton from "../components/CopyFieldButton.tsx";
import IconLink from "../components/IconLink.tsx";

const PAGE_PROFILE = {
    NAME: "Alfredo Mejia",
    TAGLINE: "Software Engineer",
    ACTION: "Download Resume",
    EMAIL: "hello@alfredomejia.dev",
    GITHUB: "https://github.com/alfredo-mejia",
    LINKEDIN: "https://www.linkedin.com/in/alfredo-mejia/",
    GITHUB_LABEL: "Go to Github profile",
    LINKEDIN_LABEL: "Go to LinkedIn profile"
};

function Home() {

    const navItems = [
        {icon: <LuBookOpenText />, title: "My Story", href: "/story", description: "Learn more about my story and experiences."},
        {icon: <LuFileText />, title: "My Resume", href: "/resume", description: "View my professional experience and skills."},
        {icon: <LuFilePen />, title: "My Blog", href: "/blog", description: "Read my latest blog posts and technical articles."},
        {icon: <LuCodeXml />, title: "My Projects", href: "/projects", description: "Explore my latest projects and portfolio."}
    ]

    return (
        <section className="content-center">
            <header className="mb-6">
                <h1 className="text-center">{PAGE_PROFILE.NAME}</h1>
                <p className="sm:text-lg text-neutral-500 text-center">{PAGE_PROFILE.TAGLINE}</p>
            </header>

            {/* Main Content */}
            <div className="flex justify-center my-8">
                <Button
                    className="text-base"
                    variant="primary"
                    icon={<LuDownload />}
                    title={PAGE_PROFILE.ACTION}
                />
            </div>

            {/* Navigation */}
            <nav className="my-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {navItems.map((item) => (
                    <NavCard
                        key={item.title}
                        icon={item.icon}
                        title={item.title}
                        description={item.description}
                        href={item.href}
                    />
                ))}
            </nav>

            {/* Footer */}
            <footer className="flex flex-col items-center gap-8 my-12">
                <CopyFieldButton value={PAGE_PROFILE.EMAIL} />

                <div className="flex gap-4">
                    <IconLink
                        icon={<LuGithub />}
                        href={PAGE_PROFILE.GITHUB}
                        iconSize="text-2xl"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={PAGE_PROFILE.GITHUB_LABEL}
                    />

                    <IconLink
                        icon={<LuLinkedin />}
                        href={PAGE_PROFILE.LINKEDIN}
                        iconSize="text-2xl"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={PAGE_PROFILE.LINKEDIN_LABEL}
                    />
                </div>
            </footer>
        </section>
    )
}

export default Home;
export { PAGE_PROFILE };