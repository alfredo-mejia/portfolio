import { type ReactNode, type AnchorHTMLAttributes } from "react";

interface IconLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    icon: ReactNode;
    title?: string;
    iconSize?: string;
    titleSize?: string;
}

function IconLink({icon, title, iconSize="", titleSize="", className="", ...props}: IconLinkProps) {
    const baseStyles = "icon-link"

    return (
        <a className={`${baseStyles} ${className}`} {...props}>
            <span className={iconSize}>{icon}</span>
            {title && <span className={titleSize}>{title}</span>}
        </a>
    )
}

export default IconLink;