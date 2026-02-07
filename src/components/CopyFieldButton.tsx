import { LuCopy, LuCheck } from "react-icons/lu";
import {
  type ButtonHTMLAttributes,
  useState,
  type MouseEventHandler,
} from "react";
import { COPY_FIELD_MSG } from "../constants/messages";

interface CopyFieldProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

function CopyFieldButton({
  value,
  className = "",
  onClick,
  ...props
}: CopyFieldProps) {
  const baseStyles = "copy-field";
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopy = () => {
    // Some browsers may throw an error even to access the clipboard.
    try {
      const clipboard = navigator.clipboard as Clipboard | undefined;

      if (!clipboard) {
        setError(COPY_FIELD_MSG.CLIPBOARD_NOT_SUPPORTED);
        return;
      }

      clipboard
        .writeText(value)
        .then(() => {
          setCopied(true);
          setError(null);
          setTimeout(() => {
            setCopied(false);
          }, 3000);
        })
        .catch(() => {
          setError(COPY_FIELD_MSG.COPY_FAILED);
          setTimeout(() => {
            setError(null);
          }, 3000);
        });
    } catch {
      setError(COPY_FIELD_MSG.CLIPBOARD_NOT_SUPPORTED);
      return;
    }
  };

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    handleCopy();
  };

  return (
    <div>
      <button
        className={`${baseStyles} ${className}`}
        {...props}
        onClick={handleClick}
        type="button"
      >
        <span>{value}</span>
        {copied ? <LuCheck /> : <LuCopy />}
      </button>

      <p
        className="text-center text-sm text-red-500 mt-2 min-h-5"
        role="status"
        aria-live="polite"
      >
        {error}
      </p>
    </div>
  );
}

export default CopyFieldButton;
