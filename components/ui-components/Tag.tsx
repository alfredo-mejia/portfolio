/**
 * The project-tag role from UI_SYSTEM.md section 4.5: a static pill with the
 * foreground/10 resting fill.
 *
 * Renders `li` inside a tag list. The project disclosure needs `span`, because
 * a `button` may only contain phrasing content and a list is not allowed there.
 */
interface TagProps {
  as?: "li" | "span";
  children: React.ReactNode;
}

const TAG_CLASS =
  "rounded-full bg-foreground/10 px-3 py-1 font-mono text-sm text-foreground";

export function Tag({ as = "li", children }: TagProps) {
  return as === "span" ? (
    <span className={TAG_CLASS}>{children}</span>
  ) : (
    <li className={TAG_CLASS}>{children}</li>
  );
}
