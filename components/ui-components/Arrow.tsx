import { ArrowRight } from "lucide-react";

interface ArrowProps {
  size?: "size-4" | "size-5";
}

export function Arrow({ size = "size-4" }: ArrowProps) {
  return (
    <ArrowRight
      aria-hidden="true"
      className={`${size} transition-transform duration-200
        motion-safe:group-hover:translate-x-1 motion-reduce:transform-none`}
    />
  );
}
