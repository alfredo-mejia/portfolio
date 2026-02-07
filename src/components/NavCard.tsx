import { type ReactNode } from "react";
import { type LinkProps, Link } from "react-router";

interface NavCardProps extends LinkProps {
    icon: ReactNode;
    title: string;
    description?: string;
}

function NavCard({ icon, title, description, className = "", ...props}: NavCardProps) {

    const baseStyles = "nav-card group"
    return (
        <Link className={`${baseStyles} ${className}`} {...props}>
            <div className="nav-card-icon">
                {icon}
            </div>

            <div className="nav-card-content">
                <p className="nav-card-title">{title}</p>
                {description && <p>{description}</p>}
            </div>
        </Link>
    )
}

export default NavCard;