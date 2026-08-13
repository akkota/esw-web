export type ProfileRole = "member" | "staff" | "admin";

export interface Profile {
  id: string;
  display_name: string | null;
  email: string | null;
  discord_user_id: string | null;
  school: string | null;
  role: ProfileRole;
}

export function isStaff(role: ProfileRole | null | undefined): boolean {
  return role === "staff" || role === "admin";
}

export function renderMarkdownLite(markdown: string): string {
  const escaped = markdown
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  const withCode = escaped.replace(/`([^`]+)`/g, "<code>$1</code>");
  const withBold = withCode.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  const withHeadings = withBold
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>");
  const withLists = withHeadings.replace(/^- (.+)$/gm, "<li>$1</li>");
  const groupedLists = withLists.replace(/(?:<li>.*<\/li>\n?)+/g, (block) => `<ul>${block}</ul>`);
  const withParagraphs = groupedLists
    .split(/\n{2,}/)
    .map((chunk) => {
      if (chunk.startsWith("<h") || chunk.startsWith("<ul")) {
        return chunk;
      }
      return `<p>${chunk.replaceAll("\n", "<br />")}</p>`;
    })
    .join("\n");

  return withParagraphs;
}
