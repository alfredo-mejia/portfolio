import { type ReactNode, type AnchorHTMLAttributes } from "react";

interface NavCardProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    icon: ReactNode;
    title: string;
    description?: string;
}

function NavCard({ icon, title, description, className = "", ...props}: NavCardProps) {

    const baseStyles = "nav-card group"
    return (
        <a className={`${baseStyles} ${className}`} {...props}>
            <div className="nav-card-icon">
                {icon}
            </div>

            <div className="nav-card-content">
                <p className="nav-card-title">{title}</p>
                {description && <p>{description}</p>}
            </div>
        </a>
    )
}

export default NavCard;