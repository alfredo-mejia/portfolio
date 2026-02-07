import Button from "../components/Button.tsx";
import NavCard from "../components/NavCard.tsx";
import CopyFieldButton from "../components/CopyFieldButton.tsx";
import IconLink from "../components/IconLink.tsx";
import { PROFILE } from "../constants/profile.tsx";
import { NAV_CARDS_ORDERED_LIST } from "../constants/navigation.tsx";

function Home() {
    return (
        <section className="content-center">
            <header className="mb-6">
                <h1 className="text-center">{PROFILE.NAME}</h1>
                <p className="sm:text-lg text-neutral-500 text-center">{PROFILE.TAGLINE}</p>
            </header>

            {/* Main Content */}
            <div className="flex justify-center my-8">
                <Button
                    className="text-base"
                    variant="primary"
                    icon={PROFILE.LINKS.RESUME.ICON}
                    title={PROFILE.LINKS.RESUME.ARIA_LABEL}
                />
            </div>

            {/* Navigation */}
            <nav className="my-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {
                    NAV_CARDS_ORDERED_LIST.map((CARD) => (
                        <NavCard
                            key={CARD.HREF}
                            icon={CARD.ICON}
                            title={CARD.TITLE}
                            description={CARD.DESCRIPTION}
                            to={CARD.HREF}
                        />
                    ))
                }
            </nav>

            {/* Footer */}
            <footer className="flex flex-col items-center gap-8 mt-12 mb-6">
                <CopyFieldButton value={PROFILE.EMAIL} />

                <div className="flex gap-4">
                    <IconLink
                        icon={PROFILE.LINKS.GITHUB.ICON}
                        href={PROFILE.LINKS.GITHUB.URL}
                        iconSize="text-2xl"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={PROFILE.LINKS.GITHUB.ARIA_LABEL}
                    />

                    <IconLink
                        icon={PROFILE.LINKS.LINKEDIN.ICON}
                        href={PROFILE.LINKS.LINKEDIN.URL}
                        iconSize="text-2xl"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={PROFILE.LINKS.LINKEDIN.ARIA_LABEL}
                    />
                </div>
            </footer>
        </section>
    )
}

export default Home;