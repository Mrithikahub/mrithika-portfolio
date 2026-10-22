// Logos live in src/assets/logos/. `npm run images` writes a small .webp next to each original;
// the .webp wins when present. A missing logo returns undefined and callers show initials instead.
const files = import.meta.glob<string>("../assets/logos/*.{webp,png,jpg,jpeg,svg}", { eager: true, query: "?url", import: "default" });

const byKey = new Map<string, string>();
for (const [path, url] of Object.entries(files)) {
  const name = path.split("/").pop()!;
  const key = name.slice(0, name.lastIndexOf(".")).toLowerCase();
  if (!byKey.has(key) || name.endsWith(".webp")) byKey.set(key, url);
}

export function logoUrl(key?: string): string | undefined {
  return key ? byKey.get(key.toLowerCase()) : undefined;
}
