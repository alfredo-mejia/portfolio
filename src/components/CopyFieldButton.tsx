import { LuCopy, LuCheck } from "react-icons/lu";
import {type ButtonHTMLAttributes, useState, type MouseEventHandler} from "react";

interface CopyFieldProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
}

const COPY_ERROR_MSGES = {
    CLIPBOARD_NOT_SUPPORTED: "Your browser does not support clipboard operations.",
    COPY_FAILED: "Copy failed. Please try again later."
}

function CopyFieldButton({value, className="", onClick, ...props}: CopyFieldProps) {
    const baseStyles = "copy-field"
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCopy = () => {
        let clipboard: Clipboard | undefined;

        // Some browsers may throw an error even to access the clipboard.
        try {
            clipboard = navigator.clipboard;
        } catch (error) {
            setError(COPY_ERROR_MSGES.CLIPBOARD_NOT_SUPPORTED);
            return;
        }

        if (!clipboard) {
            setError(COPY_ERROR_MSGES.CLIPBOARD_NOT_SUPPORTED);
            return;
        }

        clipboard
            .writeText(value)
            .then(() => {
                setCopied(true);
                setError(null);
                setTimeout(() => { setCopied(false) }, 3000);
            })
            .catch(() => {
                setError(COPY_ERROR_MSGES.COPY_FAILED);
                setTimeout(() => { setError(null) }, 3000);
            })
    }

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleCopy();
    };

    return (
        <div>
            <button className={`${baseStyles} ${className}`} {...props} onClick={handleClick} type="button">
                <span>{value}</span>
                {copied ? <LuCheck /> : <LuCopy />}
            </button>

            <p className="text-center text-sm text-red-500 mt-2 min-h-5" role="status" aria-live="polite">
                {error}
            </p>
        </div>
    )
}

export default CopyFieldButton;
export { COPY_ERROR_MSGES };

