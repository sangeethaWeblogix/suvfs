/** WP's `/params-count` endpoint labels each row's display text as `value`;
 * every consumer reads `.name` — normalise here so no label renders blank. */
export function normalizeCountItems<T>(items: T[]): T[] {
  return items.map((item) =>
    typeof item === "object" && item !== null && !("name" in item) && "value" in item
      ? { ...item, name: (item as { value: unknown }).value }
      : item
  );
}
