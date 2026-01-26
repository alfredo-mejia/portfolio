import { LuCopy } from "react-icons/lu";
import {type ButtonHTMLAttributes} from "react";

interface CopyFieldProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
}

function CopyFieldButton({value, className="",...props}: CopyFieldProps) {
    const baseStyles = "copy-field"

    return (
        <button className={`${baseStyles} ${className}`} {...props}>
            <span>{value}</span>
            <LuCopy />
        </button>
    )
}

export default CopyFieldButton;

