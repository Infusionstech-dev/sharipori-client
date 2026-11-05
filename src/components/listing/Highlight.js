const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Marks each searched word in text. React escapes the parts, so names stay safe to show.
export default function Highlight({ text, query }) {
  const words = (query ?? "").normalize("NFC").split(/\s+/).filter(Boolean);
  if (!words.length) {
    return text;
  }

  const longestFirst = [...words].sort((a, b) => b.length - a.length).map(escapeRegExp);
  const parts = text.normalize("NFC").split(new RegExp(`(${longestFirst.join("|")})`, "giu"));

  // Splitting on a captured group puts the matches at the odd positions.
  return parts.map((part, index) =>
    index % 2 ? (
      <mark key={index} className="rounded-sm bg-accent/30 text-inherit">
        {part}
      </mark>
    ) : (
      part
    )
  );
}
