import { type ReactNode, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: ReactNode;
    title?: string;
    variant?: "primary";
}

function Button({   icon /* icon to display */,
                    title /* button title */,
                    variant = "primary" /* default variant */,
                    className ="" /* allows passing tailwind classes */,
                    ...props
                }: ButtonProps) {

    const variants: Record<"primary", string> = {
        primary: "btn-primary",
    }

    return (
        <button className={`${variants[variant]} ${className}`} {...props} type="button">
            <span>{icon}</span>
            {title && <span>{title}</span>}
        </button>
    )
}

export default Button;