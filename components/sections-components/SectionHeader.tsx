import { Eyebrow } from "../ui-components/Eyebrow";

interface SectionHeaderProps {
  headingId: string;
  eyebrow: string;
  title: string;
  description?: string;
  as?: "h1" | "h2";
  /**
   * Reading measure for the introduction. Defaults to the shared lede width;
   * pass `""` when an ancestor already constrains the measure, as the article
   * rail does.
   */
  descriptionClassName?: string;
}

export function SectionHeader({
  headingId,
  eyebrow,
  title,
  description,
  as = "h2",
  descriptionClassName = "max-w-3xl",
}: SectionHeaderProps) {
  return (
    <>
      <Eyebrow label={eyebrow} />

      {/* Only the semantic level varies; globals.css owns every heading size. */}
      {as === "h1" ? (
        <h1 id={headingId}>{title}</h1>
      ) : (
        <h2 id={headingId}>{title}</h2>
      )}

      {description ? (
        <p className={`mt-6 ${descriptionClassName}`.trim()}>{description}</p>
      ) : null}
    </>
  );
}
